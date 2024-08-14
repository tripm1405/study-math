export default class ApiUtil {
    static JsonRes = function (props) {
        const {
            success,
            data: result,
            errors,
            message,
            code,
        } = {
            success: true,
            data: {},
            errors: {},
            code: 200,
            ...props,
        };

        return {
            success: success,
            result: result,
            errors: errors,
            message: message,
            code: code,
        };
    }
}