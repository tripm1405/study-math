import CourseModel from "#root/models/course.model.js";

export default class CommonUtil {
    static Pagination = class {
        static PAGE_DEFAULT = 1;
        static PAGE_SIZE_DEFAULT = 10;

        static async get(props) {
            const {
                query,
                Model,
                filter,
                extendGet,
            } = {
                extendGet: get => get,
                ...props,
                query: {
                    page: CommonUtil.Pagination.PAGE_DEFAULT,
                    pageSize: CommonUtil.Pagination.PAGE_SIZE_DEFAULT,
                    ...props.query,
                }
            };

            const skip = (query.page - 1) * query.pageSize;

            const total = await CourseModel.countDocuments(filter);
            const totalPages = Math.ceil(total / query.pageSize);
            const models = await extendGet(Model.find(filter)
                .skip(skip)
                .limit(query.pageSize)
                .lean());

            return {
                page: query.page,
                totalPages: totalPages,
                models: models.map((model, index) => {
                    return {
                        ...model,
                        index: skip + index + 1,
                    }
                }),
            };
        }
    }

    static jsonParse(value, valueDefault = null) {
        try {
            return JSON.parse(value);
        } catch {
            return valueDefault;
        }
    }

    static jsonStringify(value, valueDefault = null) {
        try {
            return JSON.stringify(value);
        } catch {
            return valueDefault;
        }
    }

    static wrapperController(controller) {
        return async (req, res, next) => {
            try {
                return await controller(req, res, next);
            } catch (err) {
                next(err);
            }
        }
    }

    static compareObj(props) {
        const {
            obj1,
            obj2,
            keyCurrent,
        } = props;
        console.log({
            obj1,
            obj2,
            keyCurrent,
        });
        const value1 = keyCurrent ? obj1[keyCurrent] : obj1;
        const value2 = keyCurrent ? obj2[keyCurrent] : obj2;

        if (typeof (value1) !== typeof ({})) {
            return value1 === value2;
        }

        for (const key in value1) {
            const result = CommonUtil.compareObj({
                obj1: value1,
                obj2: value2,
                keyCurrent: key,
            });
            if (!result) {
                return false;
            }
        }

        return true;
    }

    static excludedProperties(props) {
        const {
            obj,
            properties,
        } = {
            obj: {},
            properties: [],
            ...props,
        };
        const propertiesSet = new Set(properties);


        return Object.keys(obj)?.reduce((result, key) => {
            if (propertiesSet.has(key)) {
                return result;
            }

            return {
                ...result,
                [key]: obj[key]
            };
        }, {});
    }
}