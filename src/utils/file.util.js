import {rootPath} from "#root/uploads/index.js";

export default class FileUtil {
  static FileJsonTmpPath = `${rootPath}/tmp.json`;

  static ArrToObj = function (props) {
    const {
      files,
    } = {
      files: [],
      ...props,
    };

    return files.reduce((result, file) => {
      return {
        ...result,
        [file.fieldname]: file,
      }
    }, {});
  }
}