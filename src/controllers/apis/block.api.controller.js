import fs from 'fs';
import mongoose from "mongoose";

import BlockModel from "#root/models/block.model.js";
import ApiUtil from "#root/utils/api.util.js";
import FileUtil from "#root/utils/file.util.js";
import BlocklyUtil from "#root/utils/blockly.util.js";
import CommonUtil from "#root/utils/common.util.js";

export default {
  getList: async (req, res) => {
    const {
      questionId,
    } = req?.query;

    const filter = {
      questionId: questionId,
    };

    const blocks = await BlockModel.find(filter).lean();

    res.json(ApiUtil.JsonRes({
      data: {
        blocks: blocks.map(block => {
          return {
            ...block,
            ...BlocklyUtil.parseContent({block: block}),
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
          ...BlocklyUtil.parseContent({block: block}),
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
    await fs.unlink(file.path, () => {
    });
    const block = BlocklyUtil.parse({block: blockStr});

    const newBlock = await BlockModel.findByIdAndUpdate(id, {
      ...block,
      content: BlocklyUtil.stringifyContent({block: block}),
    });

    res.json(ApiUtil.JsonRes({
      block: newBlock,
    }))
  },
  export: async (req, res) => {
    const {
      id,
    } = req?.params;

    const block = await (async () => {
      const block = await BlockModel.findById(id).lean();
      return BlocklyUtil.formatExportBlock({
        block: block,
      });
    })();

    res.setHeader('Content-disposition', 'attachment; filename= block.json');
    res.json(ApiUtil.JsonRes({
      data: {
        ...block,
        ...BlocklyUtil.parseContent({block: block}),
        content: undefined,
      },
    }));
  },
  importList: async (req, res) => {
    const {
      questionId,
    } = req.body;
    const {
      file
    } = FileUtil.ArrToObj({
      files: req.files
    });

    const filter = {
      questionId: questionId,
    };

    const blocksMapping = await (async () => {
      const blocks = await BlockModel.find(filter).lean();
      return await blocks.reduce((result, curr) => {
        return {
          ...result,
          [curr._id]: curr,
        };
      }, {});
    })();

    const blocksFromFiles = await (async () => {
      const fileData = fs.readFileSync(file.path, {
        encoding: 'utf8',
      });

      fs.unlink(file?.path, () => {
      });

      const blocks = CommonUtil.jsonParse(fileData);
      if (blocks === null) {
        return null;
      }

      return blocks.map(block => {
        return {
          ...block,
          content: BlocklyUtil.stringifyContent({
            block: block
          }),
        };
      });
    })();
    if (blocksFromFiles === null) {
      res.json(ApiUtil.JsonRes({
        success: false,
        message: 'File ko đúng định dạng',
      }))
      return;
    }

    const blocks = blocksFromFiles.map(block => {
      const blockExists = blocksMapping[block?._id];
      console.log('blockExists', {
        blockExists: blockExists,
        blockId: block?._id,
      })
      return new BlockModel(blockExists
        ? {
          ...blockExists,
          ...CommonUtil.excludedProperties({
            obj: block,
            properties: ['_id', 'type', 'questionId'],
          }),
        }
        : ((id) => {
          return {
            ...block,
            _id: id,
            type: id,
            questionId: questionId,
          };
        })(new mongoose.Types.ObjectId()));
    });

    for (const block of blocks) {
      await BlockModel.findByIdAndUpdate(
        block._id,
        CommonUtil.excludedProperties({
          obj: block,
          properties: ['_id'],
        }),
        {
          upsert: true,
        }
      );
    }

    res.json(ApiUtil.JsonRes());
  },
  exportList: async (req, res) => {
    const {
      questionId,
    } = req?.query;

    const filter = {
      questionId: questionId,
    };

    const blocks = await (async () => {
      const blocks = await BlockModel.find(filter).lean();
      return blocks?.map(block => {
        return BlocklyUtil.formatExportBlock({
          block: {
            ...block,
            ...BlocklyUtil.parseContent({
              block: block,
            }),
            content: undefined,
          },
        });
      });
    })();

    res.setHeader('Content-disposition', 'attachment; filename= block.json');
    res.json(ApiUtil.JsonRes({
      data: blocks,
    }));
  },
}