import CommonUtil from "#root/utils/common.util.js";
import FileUtil from "#root/utils/file.util.js";

export default class BlocklyUtil {
  static BCRYPT_SALT = Number(process.env.BCRYPT_SALT) || 4;

  static ArgTypes = class {
    static FieldImage = 'field_image';
  }

  static blocks = {
    number: {
      type: 'NUMBER',
      output: 'number',
      message0: '%1',
      args0: [
        {
          type: 'field_label',
          name: 'n',
          text: '1',
        }
      ]
    }
  }

  static parse(props) {
    const {
      block,
    } = {
      block: {},
      ...props,
    };

    try {
      return JSON.parse(block);
    }
    catch {
      return {};
    }
  }

  static parseContent(props) {
    const {
      block,
    } = {
      block: {},
      ...props,
    };

    try {
      return JSON.parse(block?.content);
    }
    catch {
      return {};
    }
  }

  static stringifyContent(props) {
    const {
      block,
    } = {
      block: {},
      ...props,
    };

    return JSON.stringify(Object.keys(block).reduce((result, key) => {
      if (!key.includes('message') && !key.includes('args')) {
        return result;
      }

      return {
        ...result,
        [key]: block[key],
      }
    }, {}));
  }

  static compareContent(props) {
    const {
      content1,
      content2,
    } = props;

    function formatContent(content) {
      return content?.blocks?.blocks?.map(block => {
        return {
          fields: block.fields,
          type: block.type,
        };
      });
    }

    return CommonUtil.compareObj({
      obj1: formatContent(content1),
      obj2: formatContent(content2),
    });
  }

  static formatExportBlock(props) {
    const {
      block
    } = props;

    const excludedProperties = new Set([
      'createdAt',
      'updatedAt',
      'type',
      '__v',
    ]);

    return CommonUtil.excludedProperties({
      obj: block,
      properties: excludedProperties,
    });
  }

  static embedImages(props) {
    const {
      block,
      imageFiles,
    } = props;

    return Object.keys(block).reduce((result, key) => {
      if (!key.includes('args')) {
        return {
          ...result,
          [key]: block[key],
        };
      }

      return {
        ...result,
        [key]: block[key]?.map(args => {
          if (args.type !== BlocklyUtil.ArgTypes.FieldImage) {
            return args;
          }

          return {
            ...args,
            src: imageFiles?.find(image => image.displayName === args.src)?.physicalName,
          };
        }),
      };
    }, {});
  }

  static formatArgs(props) {
    const {
      block,
    } = props;

    return Object.keys(block)
      .reduce((result, key) => {
        if (!key.includes('args')) {
          return {
            ...result,
            [key]: block[key],
          };
        }

        return {
          ...result,
          [key]: block[key]?.map(args => {
            if (args.type !== BlocklyUtil.ArgTypes.FieldImage) {
              return args;
            }

            return {
              ...args,
              src: `${FileUtil.RootPaths.Blockly}/${args?.src}`,
            };
          }),
        };
      }, {})
  }
}