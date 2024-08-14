import ViewUtil from "#root/utils/view.util.js";
import ResolutionModel from "#root/models/resolution.model.js";
import CommonUtil from "#root/utils/common.util.js";
import FilterUtil from "#root/utils/filter.util.js";
import QuestionModel from "#root/models/question.model.js";
import {Type as UserType} from "#root/models/user.model.js";

export default {
    getList: async (req, res) => {
        const {
            questionId,
        } = req.query;


        const filter = await (async () => {
            const filter = {
                content: {
                    $ne: undefined,
                },
            };

            if (questionId) {
                filter.question = questionId;
            } else if (res.locals.currentUser.type === UserType.TEACHER) {
                filter.question = {
                    $in: await (async () => {
                        const questions = await QuestionModel
                            .find(FilterUtil.Question({
                                user: res.locals.currentUser,
                            }))
                            .lean();

                        return questions.map(question => question._id);
                    })(),
                }
            }

            return FilterUtil.Resolution({
                filters: filter,
                user: res.locals.currentUser,
            });
        })();

        const resolutions = await CommonUtil.Pagination.get({
            query: req.query.resolutions,
            Model: ResolutionModel,
            filter: filter,
            extendGet: get => {
                return get
                    .sort({
                        markedBy: 'asc',
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
                resolutions: {
                    ...resolutions,
                    models: resolutions?.models,
                },
            },
        }));
    },
    get: async (req, res) => {
        const {id} = req?.params;

        if (!id) return res.json({
            success: false,
            id: id,
        });

        const resolution = await ResolutionModel.findById(id).lean();

        const view = `${ViewUtil.getPrefixView(res.locals.currentUser?.type)}/resolution-detail.page.ejs`;
        res.render(view, ViewUtil.getOptions({
            data: {
                resolution: resolution,
            },
        }));
    },
}