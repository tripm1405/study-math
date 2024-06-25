import {rootPath} from "#root/public/index.js";

export default class FileUtil {
  static Path = class {
    static Blockly = `${rootPath}/blockly`;
    static Image = `${rootPath}/images`;
  }

  static RootPaths = class {
    static Blockly = 'http://localhost:5500/blockly';
  }

  static Keys = class {
    static FieldName = 'fieldname';
    static OriginalName = 'originalname';
  }
  static ArrToObj = function (props) {
    const {
      files,
      key,
    } = {
      files: [],
      key: FileUtil.Keys.FieldName,
      ...props,
    };

    return files.reduce((result, file) => {
      return {
        ...result,
        [file.fieldname]: [
          ...(result?.[file.fieldname] || []),
          file
        ],
      }
    }, {});
  }
}