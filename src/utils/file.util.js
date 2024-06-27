import {rootPath} from "#root/public/index.js";
import mongoose from "mongoose";

export default class FileUtil {
  static Path = class {
    static Blockly = '/blockly';
    static Image = `/images`;
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

  static format(props) {
      const {
          file,
          path,
      } = {
          path: FileUtil.Path.Image,
          ...props,
      };

      const id = new mongoose.Types.ObjectId();

      const extend = ((originNameList) => {
          return originNameList[originNameList.length - 1];
      })(file.originalname.split('.'));
      const physicalName = `${id}.${extend}`;
      const physicalDestination = `${rootPath}/${path}`;

      return {
          oldPath: file.path,
          physicalName: physicalName,
          physicalDestination: physicalDestination,
          physicalPath: `${physicalDestination}/${physicalName}`,
          displayName: file.originalname,
          destination: path,
          path: `${path}/${physicalName}`,
      }
  }
}