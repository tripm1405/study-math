import fs from 'fs';

import BlockModel from "#root/models/block.model.js";
import ApiUtil from "#root/utils/api.util.js";
import FileUtil from "#root/utils/file.util.js";
import BlocklyUtil from "#root/utils/blockly.util.js";
import CourseModel from "#root/models/course.model.js";

export default {
  getList: async (req, res) => {
    const {
      questionId,
    } = req?.query;

    const filter = {};
    if (questionId) {
      filter.questionId = questionId;
    }

    const blocks = await BlockModel.find(filter).lean();

    res.json(ApiUtil.JsonRes({
      data: {
        blocks: blocks.map(block => {
            return {
              ...block,
              ...BlocklyUtil.parseContent({ block: block }),
            }
          })
          .filter(block => block != null),
      },
    }));
  },
  get: async (req, res) => {
    const {
      id,
    } = req?.params;

    const block = await BlockModel.findById(id).lean();

    res.json(ApiUtil.JsonRes({
      data: {
        block: {
          ...block,
          ...BlocklyUtil.parseContent({ block: block }),
        },
      },
    }))
  },
  import: async (req, res) => {
    const {
      id,
    } = req?.params;
    const {
      file
    } = FileUtil.ArrToObj({
      files: req.files
    });

    const blockStr = fs.readFileSync(file.path, {
      encoding: 'utf8',
    });
    await fs.unlink(file.path, () => {});
    const block = BlocklyUtil.parse({ block: blockStr });

    const newBlock = await BlockModel.findByIdAndUpdate(id, {
      ...block,
      content: BlocklyUtil.stringifyContent({ block: block }),
    });

    res.json(ApiUtil.JsonRes({
      block: newBlock,
    }))
  },
  export: async (req, res) => {
    const {
      id,
    } = req?.params;

    const block = await BlockModel.findById(id).lean();

    res.setHeader('Content-disposition', 'attachment; filename= block.json');
    res.json(ApiUtil.JsonRes({
      data: {
        ...block,
        ...BlocklyUtil.parseContent({ block: block }),
        content: undefined,
      },
    }));
  },
  importList: async (req, res) => {
    const {
      file
    } = FileUtil.ArrToObj({
      files: req.files
    });

    const fileData = fs.readFileSync(file.path, {
      encoding: 'utf8',
    });

    fs.unlink(file?.path);

    const blocks = (() => {
      try {
        return JSON.parse(fileData);
      }
      catch {
        return [];
      }
    })();

    const blocksFormat = blocks.map(block => {
      return new BlockModel({
        ...block,
        content: BlocklyUtil.stringifyContent({
          block: block
        }),
      });
    });

    await BlockModel.create(blocksFormat);

    res.json(ApiUtil.JsonRes())
  },
  exportList: async (req, res) => {

  },
}