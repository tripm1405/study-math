import dotenv from "dotenv";
import bcrypt from 'bcryptjs';

import ViewUtil from "#root/utils/view.util.js";
import UserModel, {Type as UserType} from "#root/models/user.model.js";
import CourseModel from "#root/models/course.model.js";
import LessonModel from "#root/models/lesson.model.js";
import QuestionModel from "#root/models/question.model.js";
import AuthUtil from "#root/utils/auth.util.js";
import ResolutionModel from "#root/models/resolution.model.js";
import CommonUtil from "#root/utils/common.util.js";
import DatetimeUtil from "#root/utils/datetime.util.js";
import mongoose from "mongoose";

dotenv.config();

const commonController = {
    getHome: async (req, res) => {
        const questions = await QuestionModel.find({}).lean();
        const questionMappingById = questions.reduce((result, question) => {
            return {
                ...result,
                [question?._id.toString()]: question,
            }
        }, {});

        const result = await (async () => {
            switch (res.locals.currentUser?.type) {
                case AuthUtil.UserType.Admin: {
                    const resolutions = await ResolutionModel.find({
                        content: {
                            $ne: undefined,
                        },
                    }).lean();

                    const resolutionsCount = resolutions
                        .reduce((result, resolution) => {
                            return {
                                ...result,
                                [resolution.question]: (result?.[resolution.question] || 0) + 1,
                            }
                        }, {});
                    const resolutionsOrderByAmount = Object.keys(resolutionsCount)
                        .reduce((result, question) => {
                            return [
                                ...result,
                                {
                                    id: question,
                                    amount: resolutionsCount[question]
                                }
                            ]
                        }, [])
                        .sort((a, b) => {
                            return a?.amount > b.amount ? 1 : 0;
                        });

                    return resolutionsOrderByAmount
                        .map(e => {
                            return questionMappingById[e?.id?.toString()];
                        })
                        .filter(question => Boolean(question));
                }
                case AuthUtil.UserType.Teacher: {
                    const resolutions = await ResolutionModel.find({
                        score: undefined,
                        content: {
                            $ne: undefined,
                        },
                        createdBy: res.locals.currentUser?._id,
                    }).lean();

                    return resolutions
                        .map(resolution => {
                            return questionMappingById[resolution?.question?.toString()];
                        })
                        .filter(question => Boolean(question));
                }
                case AuthUtil.UserType.Student: {
                    const resolutions = await ResolutionModel.find({
                        score: undefined,
                        content: undefined,
                        student: res.locals.currentUser?._id,
                    });

                    return resolutions
                        .map(resolution => {
                            return questionMappingById[resolution?.question?.toString()];
                        })
                        .filter(question => Boolean(question));
                }
            }
        })();

        res.render('pages/home.page.ejs', ViewUtil.getOptions({
            data: {
                questions: result,
            },
        }));
    },
    getProfile: async (req, res) => {
        const user = await UserModel.findOne({
            _id: res.locals.currentUser?._id,
        });

        res.render('pages/profile.page.ejs', ViewUtil.getOptions({
            data: {
                user: user,
            },
        }));
    },
    getSearch: async (req, res) => {
        const {search} = req.query;

        const filter = {
            code: {
                $regex: new RegExp(search, 'i'),
            },
        }

        const courses = await CommonUtil.Pagination.get({
            query: req.query.courses,
            Model: CourseModel,
            filter: filter,
        });

        const lessons = await CommonUtil.Pagination.get({
            query: req.query.lessons,
            Model: LessonModel,
            filter: filter,
        });

        const questions = await CommonUtil.Pagination.get({
            query: req.query.questions,
            Model: QuestionModel,
            filter: filter,
        });
        res.render('pages/search.page.ejs', ViewUtil.getOptions({
            data: {
                search: search,
                courses: courses,
                lessons: lessons,
                questions: questions,
            },
        }));
    },
    getSignIn: (req, res) => {
        if (req?.cookies?.user) {
            res.redirect('/');
            return;
        }

        res.render('pages/sign-in.page.ejs', ViewUtil.getOptions({
            layout: false,
        }));
    },
    getSignOut: (req, res) => {
        res.cookie('user', '', {httpOnly: true}, {signed: true});
        res.redirect('/sign-in');
    },
    getNotFound: (req, res) => {
        res.render('pages/not-found.page.ejs', ViewUtil.getOptions({
            layout: false,
        }));
    },
    getStatistics: async (req, res) => {
        const resolutionAmountByDayOfMonth = await (async () => {
            const date = DatetimeUtil.getStartEndOfCurrentMonth();

            const resolutions = await ResolutionModel.find({
                content: {
                    $ne: undefined,
                },
                createdAt: {
                    $gte: date?.start,
                    $lt: date?.end,
                },
            });

            return resolutions
                .map(resolution => {
                    return {
                        ...resolution,
                        key: DatetimeUtil.Format.get({
                            type: DatetimeUtil.Format.type.DATE,
                            date: resolution.createdAt,
                        })
                    }
                })
                .reduce((result, current) => {
                    return {
                        ...result,
                        [current.key]: (result[current.key] || 0) + 1,
                    }
                }, {});
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

        res.render('pages/statistics.page.ejs', ViewUtil.getOptions({
            data: {
                resolutionAmountByDayOfMonth: resolutionAmountByDayOfMonth,
                studentAmount: studentAmount,
                questionAmount: questionAmount,
                question: question,
            },
        }));
    },
    getChangePassword: async (req, res) => {
        res.render('pages/change-password.page.ejs', ViewUtil.getOptions());
    },
};

export default {
    getHome: commonController.getHome,
    getProfile: commonController.getProfile,
    getSearch: commonController.getSearch,
    getSignIn: commonController.getSignIn,
    getSignOut: commonController.getSignOut,
    getNotFound: commonController.getNotFound,
    getStatistics: commonController.getStatistics,
    getChangePassword: commonController.getChangePassword,
};