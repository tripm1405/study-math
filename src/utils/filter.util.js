import {Type as UserType} from "#root/models/user.model.js";
import mongoose from "mongoose";
import AuthUtil from "#root/utils/auth.util.js";

export default class FilterUtil {
    static User = (props) => {
        const {
            filters: {
                code,
                email,
            },
            user,
            useDefault,
        } = {
            useDefault: false,
            ...props,
        };

        const filter = {};
        if (user?.type !== UserType.ADMIN) {
            filter.createdBy = new mongoose.Types.ObjectId(user?._id);
        }
        if (user?.type === UserType.TEACHER) {
            if (filter.type) {
                filter.type = AuthUtil.UserType.Student;
            }
        }
        if (code) {
            filter.code = {
                $regex : new RegExp(code, 'i'),
            };
        }
        if (email) {
            filter.email = {
                $regex : new RegExp(email, 'i'),
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
        } = {
            ...props,
            filters: {
                ...props.filters,
            }
        };

        const result = {};
        if (code) {
            result.code = {
                $regex : new RegExp(code, 'i'),
            };
        }

        return result;
    }

    static Class = (props) => {
        const {
            filters: {
                code,
                name,
            },
        } = {
            ...props,
            filters: {
                ...props.filters,
            }
        };

        const result = {};
        if (code) {
            result.code = {
                $regex : new RegExp(code, 'i'),
            };
        }
        if (name) {
            result.name = {
                $regex : new RegExp(name, 'i'),
            };
        }

        return result;
    }

    static Course = (props) => {
        const {
            filters: {
                code,
                name,
            },
        } = {
            ...props,
            filters: {
                ...props.filters,
            }
        };

        const result = {};
        if (code) {
            result.code = {
                $regex : new RegExp(code, 'i'),
            };
        }
        if (name) {
            result.name = {
                $regex : new RegExp(name, 'i'),
            };
        }

        return result;
    }

    static Lesson = (props) => {
        const {
            filters: {
                code,
                name,
            },
        } = {
            ...props,
            filters: {
                ...props.filters,
            }
        };

        const result = {};
        if (code) {
            result.code = {
                $regex : new RegExp(code, 'i'),
            };
        }
        if (name) {
            result.name = {
                $regex : new RegExp(name, 'i'),
            };
        }

        return result;
    }

    static Block = (props) => {
        const {
            filters: {
                name,
            },
        } = {
            ...props,
            filters: {
                ...props.filters,
            }
        };

        const result = {};
        if (name) {
            result.name = {
                $regex : new RegExp(name, 'i'),
            };
        }

        return result;
    }
}