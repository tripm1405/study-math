export default class ApiUtil {
  static JsonRes = function (props) {
    const {
      success,
      data,
    } = {
      success: true,
      data: {},
      ...props,
    };

    return {
      success,
      result: data,
    };
  }
}