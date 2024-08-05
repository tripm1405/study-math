import mongoose from "mongoose";

import BlockModel from "#root/models/block.model.js";
import ApiUtil from "#root/utils/api.util.js";
import BlocklyUtil from "#root/utils/blockly.util.js";
import CommonUtil from "#root/utils/common.util.js";
import FileService, {Destination} from "#root/services/file.service.js";

const controller = {
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

            return blocks.filter(block => block != null);
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

            return BlocklyUtil.Format.decode({block: block,});
        })();

        res.json(ApiUtil.JsonRes({
            data: {
                block: block,
            },
        }))
    },
    create: async (req, res) => {
        const {
            block,
        } = req.body;

        const id = new mongoose.Types.ObjectId();
        await BlockModel.create({
            _id: id,
            ...BlocklyUtil.Format.encode({block: block,}),
            type: id,
            createdBy: new mongoose.Types.ObjectId(res?.locals?.currentUser?._id),
        });

        res.json(ApiUtil.JsonRes());
    },
    update: async (req, res) => {
        const {
            id
        } = req.params;
        const {
            block,
        } = req.body;
        
        const images = await FileService.create({
            files: req.files?.filter(file => file.fieldname === 'images'),
            destination: Destination.BLOCKLY,
        });

        await BlockModel.findByIdAndUpdate(id, {
            ...BlocklyUtil.Format.encode({
                block: CommonUtil.excludedProperties({
                    obj: block,
                    properties: ['_id', 'type', 'question', 'createdBy', 'createdAt'],
                }),
                images: images,
            }),
        });

        res.json(ApiUtil.JsonRes());
    },
    remove: async (req, res) => {
        const {id} = req?.params;

        await BlockModel.findByIdAndDelete(new mongoose.Types.ObjectId(id));

        res.json(ApiUtil.JsonRes());
    },
    import: async (req, res) => {
        const {
            id,
        } = req?.params;

        const imageFiles = await FileService.create({
            files: req.files?.filter(file => file.fieldname === 'images'),
        });

        const block = (() => {
            const blockFile = req.files?.find(file => file.fieldname === 'block');
            const blockStr = FileService.read({
                path: blockFile.path,
                hasRemove: true,
            });

            return BlocklyUtil.Format.encode({
                block: CommonUtil.jsonParse(blockStr, {}),
                images: imageFiles,
            })
        })();

        await BlockModel.findByIdAndUpdate(id, block);

        res.json(ApiUtil.JsonRes());
    },
    export: async (req, res) => {
        const {
            id,
        } = req?.params;

        const block = await BlockModel.findById(new mongoose.Types.ObjectId(id)).lean();
        const blockFormat = BlocklyUtil.Format.export({block: block,});

        res.setHeader('Content-disposition', 'attachment; filename= block.json');
        res.json(ApiUtil.JsonRes({
            data: {
                ...blockFormat,
            },
        }));
    },
    importList: async (req, res) => {
        const {
            questionId,
        } = req.body;

        const imageFiles = await FileService.create({
            files: req.files?.filter(file => file.fieldname === 'images'),
        });

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

        const blocksFromFiles = (() => {
            const blockFile = req.files?.find(file => file.fieldname === 'block');
            const fileData = FileService.read({
                path: blockFile.path,
                hasRemove: true,
            })

            const blocks = CommonUtil.jsonParse(fileData, []);

            return blocks
                .map(block => {
                    return BlocklyUtil.Format.encode({
                        block: block,
                        images: imageFiles,
                    })
                });
        })();

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

        res.json(ApiUtil.JsonRes());
    },
    exportList: async (req, res) => {
        const {
            questionId,
        } = req?.query;

        const filter = {
            question: questionId,
        };

        const blocks = await BlockModel.find(filter).lean();
        const blockFormats = blocks?.map(block => {
            return BlocklyUtil.Format.export({
                block: block,
            });
        });

        res.setHeader('Content-disposition', 'attachment; filename= block.json');
        res.json(ApiUtil.JsonRes({
            data: blockFormats,
        }));
    },
    getDefault: async (req, res) => {
        res.json(ApiUtil.JsonRes({
            data: {
                block: BlocklyUtil.Default.Substance,
            }
        }))
    },
}

export default {
    getList: controller.getList,
    get: controller.get,
    create: controller.create,
    update: controller.update,
    remove: controller.remove,
    import: controller.import,
    export: controller.export,
    importList: controller.importList,
    exportList: controller.exportList,
    getDefault: controller.getDefault,
}