import ViewUtil from "#root/utils/view.util.js";
import BlockModel from "#root/models/block.model.js";
import CommonUtil from "#root/utils/common.util.js";
import FilterUtil from "#root/utils/filter.util.js";
import mongoose from "mongoose";
import BlocklyUtil from "#root/utils/blockly.util.js";

export default {
    get: async (req, res) => {
        const { questionId } = req.query;

        const newId = new mongoose.Types.ObjectId();
        const filter = FilterUtil.Block({
            filters: {
                ...req.query,
                question: questionId,
            },
        });

        console.log('filter', filter);
        const blocks = await CommonUtil.Pagination.get({
            query: req.query?.blocks,
            Model: BlockModel,
            filter: filter,
            extendGet: get => {
                return get
                    .populate('createdBy')
                    .lean();
            },
        });

        const view = 'pages/managers/block.page.ejs'
        res.render(view, ViewUtil.getOptions({
            data: {
                blocks: blocks,
                filters: req.query,
                questionId: questionId,
                newId: newId,
            },
        }));
    },
    getDetail: async (req, res) => {
        const {questionId} = req.query;
        const {id} = req?.params;

        if (!id) return res.json({
            success: false,
            id: id,
        });

        const block = await BlockModel.findById(id).lean();
        const blockSubstance = CommonUtil.jsonParse(block?.substance, BlocklyUtil.Default.Substance);
        const argss = Object.keys(blockSubstance).filter(e => e.includes('args')).map((e, i) => {
            return blockSubstance[`args${i}`];
        });

        const view = 'pages/managers/block-detail.page.ejs';
        res.render(view, ViewUtil.getOptions({
            data: {
                block: block,
                argss: argss,
                questionId: questionId,
            },
        }));
    },
    post: async (req, res) => {
        const {code, name, content, note} = req.body;

        const block = await BlockModel.create({
            code: code,
            name: name,
            content: content,
            note: note,
            createdBy: res?.locals?.currentUser?._id,
        });

        res.json({
            result: {
                success: true,
                block: block,
            },
        });
    },
    put: async (req, res) => {
        const {id} = req?.params;
        const {name, content, note} = req.body;

        const block = await BlockModel.findByIdAndUpdate(id, {
            name: name,
            content: content,
            note: note,
        });

        res.json({
            result: {
                success: true,
                block: block,
            },
        });
    },
}