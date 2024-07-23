import ViewUtil from "#root/utils/view.util.js";
import BlockModel from "#root/models/block.model.js";
import CommonUtil from "#root/utils/common.util.js";
import FilterUtil from "#root/utils/filter.util.js";

export default {
    get: async (req, res) => {
        const filter = FilterUtil.Block({
            filters: req.query,
        });
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

        res.render('pages/managers/block.page.ejs', ViewUtil.getOptions({
            data: {
                blocks: blocks,
                filters: req.query,
            },
        }));
    },
    getDetail: async (req, res) => {
        const {id} = req?.params;

        if (!id) return res.json({
            success: false,
            id: id,
        });

        const block = await BlockModel.findById(id);

        const blockContent = (() => {
            try {
                return JSON.parse(block?.content);
            } catch {
                return {
                    args0: [
                        {
                            type: 'field_label',
                            text: 'Text',
                        },
                    ],
                };
            }
        })();

        const argss = Object.keys(blockContent).filter(e => e.includes('args')).map((e, i) => {
            return blockContent[`args${i}`];
        });

        res.render('pages/managers/block-detail.page.ejs', ViewUtil.getOptions({
            data: {
                block: block,
                argss: argss,
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
    delete: async (req, res) => {
        const {id} = req?.params;

        await BlockModel.findByIdAndDelete(id);

        res.json({
            result: {
                success: true,
            },
        });
    },
}