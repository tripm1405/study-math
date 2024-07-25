import ApiUtil from "#root/utils/api.util.js";
import ViewUtil from "#root/utils/view.util.js";
import DatetimeUtil from "#root/utils/datetime.util.js";
import ResolutionModel from "#root/models/resolution.model.js";
import UserModel, {Type as UserType} from "#root/models/user.model.js";
import QuestionModel from "#root/models/question.model.js";

export default {
    getConstants: async (req, res) => {
        res.json(ApiUtil.JsonRes({
            data: {
                PARTIAL_PATH: ViewUtil.PARTIAL_PATH,
                WS_HREF: ViewUtil.WS_HREF,
            },
        }));
    },
    getStatistics: async (req, res) => {
        const resolutionAmountByDayOfMonth = await (async () => {
            const date = DatetimeUtil.getStartEndOfCurrentMonth();
            const dateRange = DatetimeUtil.getRange({
                start: date?.start,
                end: date?.end,
            })
                .reduce((result, current) => {
                    return {
                        ...result,
                        [DatetimeUtil.Format.get({
                            type: DatetimeUtil.Format.type.DATE,
                            date: current,
                        })]: 0,
                    }
                }, {});

            const resolutions = await ResolutionModel.find({
                content: {
                    $ne: undefined,
                },
                createdAt: {
                    $gte: date?.start,
                    $lt: date?.end,
                },
            });

            resolutions
                .map(resolution => {
                    return {
                        ...resolution,
                        key: DatetimeUtil.Format.get({
                            type: DatetimeUtil.Format.type.DATE,
                            date: resolution.createdAt,
                        })
                    }
                })
                .forEach(resolution => {
                    dateRange[resolution.key] = dateRange[resolution.key] + 1
                });

            return dateRange;
        })();
        const studentAmount = await UserModel.countDocuments({
            type: UserType.STUDENT,
        });
        const questionAmount = await UserModel.countDocuments({});
        const question = await (async () => {
            const resolutions = await ResolutionModel.find({});
            const resolutionAmountByQuestionId = resolutions
                .reduce((result, current) => {
                    return {
                        ...result,
                        [current.question]: (result[current.question] || 0) + 1,
                    }
                }, {});
            const questionId = Object.keys(resolutionAmountByQuestionId)
                .map(key => {
                    return {
                        key: key,
                        value: resolutionAmountByQuestionId[key],
                    };
                })
                .reduce((result, current) => {
                    return result?.value > current?.value ? result : current;
                }, undefined).key;
            return QuestionModel.findById(questionId);
        })();

        res.json(ApiUtil.JsonRes({
            data: {
                resolutionAmountByDayOfMonth: resolutionAmountByDayOfMonth,
                studentAmount: studentAmount,
                questionAmount: questionAmount,
                question: question,
            },
        }));
    },
}