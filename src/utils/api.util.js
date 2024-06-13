export default class ApiUtil {
  static JsonRes = function (props) {
    const {
      success,
      data,
      errors,
    } = {
      success: true,
      data: {},
      errors: {},
      ...props,
    };

    return {
      success,
      result: data,
      errors: errors,
    };
  }
}