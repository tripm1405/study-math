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
}