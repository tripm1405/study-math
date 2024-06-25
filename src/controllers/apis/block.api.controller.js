import fs from 'fs';
import mongoose from "mongoose";

import BlockModel from "#root/models/block.model.js";
import ApiUtil from "#root/utils/api.util.js";
import BlocklyUtil from "#root/utils/blockly.util.js";
import CommonUtil from "#root/utils/common.util.js";
import {rootPath} from "#root/public/index.js";
import FileModel from "#root/models/file.model.js";
import FileUtil from "#root/utils/file.util.js";

export default {
  getList: async (req, res) => {
    const {
      questionId,
      all,
    } = req?.query;

    const blocks = await (async () => {
      const filter = all ? {} : {
        question: questionId,
      };

      const blocks = await BlockModel.find(filter).lean();

      return blocks
        .map(block => {
          return BlocklyUtil.formatArgs({
            block: {
              ...block,
              ...BlocklyUtil.parseContent({
                block: block
              }),
            },
          });
        })
        .filter(block => block != null);
    })();

    res.json(ApiUtil.JsonRes({
      data: {
        blocks: blocks,
      },
    }));
  },
  get: async (req, res) => {
    const {
      id,
    } = req?.params;

    const block = await (async () => {
      const block = await BlockModel.findById(id).lean();

      return BlocklyUtil.formatArgs({
        block: {
          ...block,
          ...BlocklyUtil.parseContent({block: block}),
        },
      });
    })();

    res.json(ApiUtil.JsonRes({
      data: {
        block: block,
      },
    }))
  },
  import: async (req, res) => {
    const {
      id,
    } = req?.params;
    const blockFile = req.files?.find(file => file.fieldname === 'block');
    const imageFiles = req.files
      ?.filter(file => file.fieldname === 'images')
      ?.map(file => {
        const id = new mongoose.Types.ObjectId();

        const extend = ((originNameList) => {
          return originNameList[originNameList.length - 1];
        })(file.originalname.split('.'));
        const physicalName = `${id}.${extend}`;
        const destination = `${rootPath}/blockly/`;

        return {
          oldPath: file.path,
          displayName: file.originalname,
          physicalName: physicalName,
          destination: destination,
          path: `${destination}/${physicalName}`,
        }
      });

    for (const image of imageFiles) {
      fs.rename(image?.oldPath, image.path, () => {
      });
    }

    const blockStr = fs.readFileSync(blockFile.path, {
      encoding: 'utf8',
    });
    await fs.unlink(blockFile.path, () => {
    });
    const block = BlocklyUtil.embedImages({
      block: BlocklyUtil.parse({block: blockStr}),
      imageFiles: imageFiles,
    });

    const newBlock = await BlockModel.findByIdAndUpdate(id, {
      ...block,
      content: BlocklyUtil.stringifyContent({block: block}),
    });

    await FileModel.create(imageFiles);

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
    const blockFile = req.files?.find(file => file.fieldname === 'block');
    const imageFiles = req.files
      ?.filter(file => file.fieldname === 'images')
      ?.map(file => {
        const id = new mongoose.Types.ObjectId();

        const extend = ((originNameList) => {
          return originNameList[originNameList.length - 1];
        })(file.originalname.split('.'));
        const physicalName = `${id}.${extend}`;
        const destination = `${rootPath}/blockly/`;

        return {
          oldPath: file.path,
          displayName: file.originalname,
          physicalName: physicalName,
          destination: destination,
          path: `${destination}/${physicalName}`,
        }
      });

    for (const image of imageFiles) {
      fs.rename(image?.oldPath, image.path, () => {
      });
    }

    const filter = {
      question: questionId,
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
      const fileData = fs.readFileSync(blockFile.path, {
        encoding: 'utf8',
      });

      fs.unlink(blockFile?.path, () => {
      });

      const blocks = CommonUtil.jsonParse(fileData);
      if (blocks === null) {
        return null;
      }

      return blocks
        .map(block => {
          return BlocklyUtil.embedImages({
            block: block,
            imageFiles: imageFiles,
          });
        })
        .map(block => {
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
      return new BlockModel(blockExists
        ? {
          ...blockExists,
          ...CommonUtil.excludedProperties({
            obj: block,
            properties: ['_id', 'type', 'question'],
          }),
        }
        : ((id) => {
          return {
            ...block,
            _id: id,
            type: id,
            question: questionId,
            createdBy: res.locals.currentUser?._id,
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

    await FileModel.create(imageFiles);

    res.json(ApiUtil.JsonRes());
  },
  exportList: async (req, res) => {
    const {
      questionId,
    } = req?.query;

    const filter = {
      question: questionId,
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