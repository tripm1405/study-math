export default class ApiUtil {
  static JsonRes = function (props) {
    const {
      success,
      data,
      errors,
      message,
    } = {
      success: true,
      data: {},
      errors: {},
      ...props,
    };

    return {
      success: success,
      result: data,
      errors: errors,
      message: message,
    };
  }
}