import ApiUtil from "#root/utils/api.util.js";
import ViewUtil from "#root/utils/view.util.js";
import DatetimeUtil from "#root/utils/datetime.util.js";
import ResolutionModel from "#root/models/resolution.model.js";
import UserModel, {Type as UserType} from "#root/models/user.model.js";
import QuestionModel from "#root/models/question.model.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import AuthUtil from "#root/utils/auth.util.js";
import CommonUtil from "#root/utils/common.util.js";
import CourseModel from "#root/models/course.model.js";
import LessonModel from "#root/models/lesson.model.js";

const controller = {
    postSignIn: async (req, res) => {
        const {username, password} = req.body;

        const user = await UserModel
            .findOne({
                username: username
            })
            .lean();

        if (!user) {
            res.json(ApiUtil.JsonRes({
                success: false,
                message: 'Thông tin đăng nhập không chính xác!',
            }));
            return;
        }

        const isCorrectPassword = await bcrypt.compareSync(password, user?.password);
        if (!isCorrectPassword) {
            res.json(ApiUtil.JsonRes({
                success: false,
                message: 'Thông tin đăng nhập không chính xác!',
            }));
            return;
        }

        res.cookie('user', {
            username: user?.username,
            type: user?.type,
        }, {
            httpOnly: true
        }, {
            signed: true
        });
        res.json(ApiUtil.JsonRes());
    },
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
                }, undefined)?.key;
            return questionId && await QuestionModel.findById(new mongoose.Types.ObjectId(questionId));
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
    postChangePassword: async (req, res) => {
        const {
            currentPassword,
            newPassword,
        } = req.body;

        const user = await UserModel.findOne(new mongoose.Types.ObjectId(res.locals.currentUser?._id)).lean();
        const isCorrectPassword = await bcrypt.compareSync(currentPassword, user?.password);

        if (!isCorrectPassword) {
            res.json(ApiUtil.JsonRes({
                success: false,
                message: 'Mật khẩu không chính xác',
            }));
            return;
        }

        const passwordHash = await bcrypt.hash(newPassword, AuthUtil.BCRYPT_SALT);
        await UserModel.findByIdAndUpdate(user._id, {
            password: passwordHash,
        });
        res.json(ApiUtil.JsonRes());
    },
    updateProfile: async (req, res) => {
        const {
            fullName,
            email,
        } = req.body;

        await UserModel.findByIdAndUpdate(new mongoose.Types.ObjectId(res.locals.currentUser?._id), {
            fullName: fullName,
            email: email,
        });

        res.json(ApiUtil.JsonRes());
    },
};

export default {
    postSignIn: controller.postSignIn,
    getConstants: controller.getConstants,
    getStatistics: controller.getStatistics,
    postChangePassword: controller.postChangePassword,
    updateProfile: controller.updateProfile,
};