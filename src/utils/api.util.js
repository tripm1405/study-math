export default class ApiUtil {
  static JsonRes = function (props) {
    const {
      success,
      data: result,
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
      result: result,
      errors: errors,
      message: message,
    };
  }
}