import UserModel, {Type as UserType} from "#root/models/user.model.js";
import mongoose from "mongoose";
import AuthUtil from "#root/utils/auth.util.js";
import ResolutionModel from "#root/models/resolution.model.js";
import BlockModel from "#root/models/block.model.js";

export default class FilterUtil {
    static User = (props) => {
        const {
            filters: {
                code,
                email,
                ...filters
            },
            user,
            useDefault,
        } = {
            useDefault: false,
            ...props,
            filters: {
                ...props.filters,
            }
        };

        const schemaKeys = Object.keys(UserModel.schema.paths);
        const filter = Object.keys(filters).reduce((result, key) => {
            if (schemaKeys.find(userKey => userKey === key)) {
                return {
                    ...result,
                    [key]: filters[key],
                }
            }

            return result
        }, {});

        if (user?.type !== UserType.ADMIN) {
            if (user?.type === UserType.TEACHER) {
                if (!filter.type) {
                    filter.type = AuthUtil.UserType.Student;
                }
                filter.createdBy = new mongoose.Types.ObjectId(user?._id);
            }
        }
        if (code) {
            filter.code = {
                $regex: new RegExp(code, 'i'),
            };
        }
        if (email) {
            filter.email = {
                $regex: new RegExp(email, 'i'),
            };
        }

        return useDefault
            ? {
                $and: [
                    {
                        type: {
                            $ne: 'Admin',
                        },
                    },
                    filter,
                ],
            }
            : filter;
    }

    static Question = (props) => {
        const {
            filters: {
                code,
            },
            user,
        } = {
            ...props,
            filters: {
                ...props.filters,
            }
        };

        const filter = {};
        if (user && ![UserType.ADMIN, UserType.STUDENT].includes(user?.type)) {
            filter.createdBy = new mongoose.Types.ObjectId(user?._id);
        }
        if (code) {
            filter.code = {
                $regex: new RegExp(code, 'i'),
            };
        }

        return filter;
    }

    static Class = (props) => {
        const {
            filters: {
                code,
                name,
            },
            user,
        } = {
            ...props,
            filters: {
                ...props.filters,
            }
        };

        const filter = {};
        if (user?.type !== UserType.ADMIN) {
            if (user?.type === UserType.TEACHER) {
                filter.createdBy = new mongoose.Types.ObjectId(user?._id);
            }
        }
        if (code) {
            filter.code = {
                $regex: new RegExp(code, 'i'),
            };
        }
        if (name) {
            filter.name = {
                $regex: new RegExp(name, 'i'),
            };
        }

        return filter;
    }

    static Course = (props) => {
        const {
            filters: {
                code,
                name,
            },
            user,
        } = {
            ...props,
            filters: {
                ...props.filters,
            }
        };

        const filter = {};
        if (user && ![UserType.ADMIN, UserType.STUDENT].includes(user?.type)) {
            filter.createdBy = new mongoose.Types.ObjectId(user?._id);
        }
        if (code) {
            filter.code = {
                $regex: new RegExp(code, 'i'),
            };
        }
        if (name) {
            filter.name = {
                $regex: new RegExp(name, 'i'),
            };
        }

        return filter;
    }

    static Lesson = (props) => {
        const {
            filters: {
                code,
                name,
            },
            user,
        } = {
            ...props,
            filters: {
                ...props.filters,
            }
        };

        const filter = {};
        if (user && ![UserType.ADMIN, UserType.STUDENT].includes(user?.type)) {
            filter.createdBy = new mongoose.Types.ObjectId(user?._id);
        }
        if (code) {
            filter.code = {
                $regex: new RegExp(code, 'i'),
            };
        }
        if (name) {
            filter.name = {
                $regex: new RegExp(name, 'i'),
            };
        }

        return filter;
    }

    static Block = (props) => {
        const {
            filters: {
                name,
                ...filters
            },
        } = {
            ...props,
            filters: {
                ...props.filters,
            }
        };

        const result = FilterUtil.handleDefault({Model: BlockModel, filters: filters});
        if (name) {
            result.name = {
                $regex: new RegExp(name, 'i'),
            };
        }

        return result;
    }

    static Resolution = (props) => {
        const {
            filters: {
                ...filters
            },
            user,
        } = {
            ...props,
            filters: {
                ...props.filters,
            }
        };

        const schemaKeys = Object.keys(ResolutionModel.schema.paths);
        const filter = Object.keys(filters).reduce((result, key) => {
            if (schemaKeys.find(userKey => userKey === key)) {
                return {
                    ...result,
                    [key]: filters[key],
                }
            }

            return result
        }, {});

        if (user) {
            switch (user?.type) {
                case UserType.TEACHER: {
                    break;
                }
                case UserType.STUDENT: {
                    filter.student = user?._id;
                    break;
                }
                default:
                case UserType.ADMIN: {
                    break;
                }
            }
        }

        return filter;
    }

    static handleDefault = (props) => {
        const {Model, filters} = props;

        const schemaKeys = Object.keys(Model.schema.paths);
        return Object.keys(filters).reduce((result, key) => {
            if (schemaKeys.find(userKey => userKey === key)) {
                return {
                    ...result,
                    [key]: filters[key],
                }
            }

            return result
        }, {});
    }
}