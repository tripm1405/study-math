export default class CommonUtil {
  static jsonParse(value, valueDefault) {
    try {
      return JSON.parse(value);
    }
    catch {
      return valueDefault;
    }
  }

  static jsonStringify(value, valueDefault) {
    try {
      return JSON.stringify(value);
    }
    catch {
      return valueDefault;
    }
  }

  static wrapperController(controller) {
    return async (req, res, next) => {
      try {
        return await controller(req, res, next);
      }
      catch (err) {
        next(err);
      }
    }
  }
}