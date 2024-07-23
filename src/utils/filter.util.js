export default class FilterUtil {
    static Account = (props) => {
        const {
            code,
            email,
        } = props.filters;

        const result = {};
        if (code) {
            result.code = {
                $regex : new RegExp(code, 'i'),
            };
        }
        if (email) {
            result.email = {
                $regex : new RegExp(email, 'i'),
            };
        }

        return result;
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