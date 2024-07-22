import ViewUtil from "#root/utils/view.util.js";
import ResolutionModel from "#root/models/resolution.model.js";
import CommonUtil from "#root/utils/common.util.js";

export default {
    getList: async (req, res) => {
        const {
            questionId,
        } = req.query;

        const filter = {
            score: undefined,
            content: {
                $ne: undefined,
            },
        };
        if (questionId) {
            filter.question = questionId;
        }

        const resolutions = await CommonUtil.Pagination.get({
            query: req.query.resolutions,
            Model: ResolutionModel,
            filter: filter,
            extendGet: get => {
                return get
                    .sort({
                        solvedAt: 'desc',
                    })
                    .populate('student')
                    .populate('question')
                    .lean();
            },
        });

        const view = `${ViewUtil.getPrefixView(res.locals.currentUser?.type)}/resolution.page.ejs`;
        res.render(view, ViewUtil.getOptions({
            data: {
                resolutions: resolutions,
            },
        }));
    },
    get: async (req, res) => {
        const {id} = req?.params;

        if (!id) return res.json({
            success: false,
            id: id,
        });

        const resolution = await ResolutionModel.findById(id);

        const view = `${ViewUtil.getPrefixView(res.locals.currentUser?.type)}/resolution-detail.page.ejs`;
        res.render(view, ViewUtil.getOptions({
            data: {
                resolution: resolution,
            },
        }));
    },
}