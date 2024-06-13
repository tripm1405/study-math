import CommonUtil from "#root/utils/common.util.js";

export default class BlocklyUtil {
  static BCRYPT_SALT = Number(process.env.BCRYPT_SALT) || 4;

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
}