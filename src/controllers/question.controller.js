import mongoose from "mongoose";
import ViewUtil from "#root/utils/view.util.js";
import QuestionModel from "#root/models/question.model.js";
import AuthUtil from "#root/utils/auth.util.js";
import LessonModel from "#root/models/lesson.model.js";
import BlockModel from "#root/models/block.model.js";
import ResolutionModel from "#root/models/resolution.model.js";
import AnswerModel from "#root/models/answer.model.js";
import UserModel from "#root/models/user.model.js";
import CommonUtil from "#root/utils/common.util.js";
import CourseModel from "#root/models/course.model.js";
import NotificationModel, {Status, Type} from "#root/models/notification.model.js";
import NotificationService from "#root/services/notification.service.js";
import FilterUtil from "#root/utils/filter.util.js";

const controllers = {
    get: async (req, res) => {
        const newId = new mongoose.Types.ObjectId();
        const filter = FilterUtil.Question({
            filters: req.query,
        });
        const {
            currentPage: currentPage,
            totalPages: totalPages,
            models: questions,
        } = await CommonUtil.Pagination.get({
            query: req.query,
            Model: QuestionModel,
            filter: filter,
            extendGet: get => {
                return get
                    .populate('createdBy')
                    .lean();
            },
        });

        const view = `${ViewUtil.getPrefixView(res.locals.currentUser?.type)}/question.page.ejs`;
        res.render(view, ViewUtil.getOptions({
            data: {
                newId: newId,
                questions: questions,
                currentPage: currentPage,
                totalPages: totalPages,
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

        const resolutions = await ResolutionModel
            .find({
                question: id,
            })
            .lean();

        const question = await QuestionModel
            .findById(id)
            .populate('createdBy')
            .lean() || {};
        const lessons = await LessonModel.find({});
        const blocks = await BlockModel.find({
            question: new mongoose.Types.ObjectId(id),
        });

        const view = `${ViewUtil.getPrefixView(res.locals.currentUser?.type)}/question-detail.page.ejs`;
        res.render(view, ViewUtil.getOptions({
            data: {
                question: {
                    ...question,
                    blocksDefault: JSON.parse(question?.blocksDefault || '{}'),
                    toolbox: JSON.parse(question?.toolbox || '{}'),
                },
                blocks: blocks,
                lessons: lessons,
                resolutions: resolutions,
                resolution: resolutions?.find(resolution => {
                    return resolution?.student.toString() === res.locals?.currentUser?._id.toString();
                }),
            },
        }));
    },
    post: async (req, res) => {
        const {code, name, result, blocksDefault, toolbox, lessonId, answers} = req.body;

        const question = await QuestionModel.create({
            code: code,
            name: name,
            blocksDefault: blocksDefault,
            toolbox: toolbox,
            result: result,
            lesson: lessonId,
            answers: answers,
            createdBy: res?.locals?.currentUser?._id,
        });

        res.json({
            result: {
                success: true,
                question: question,
            },
        });
    },
    put: async (req, res) => {
        const {id} = req?.params;
        const {name, result, blocksDefault, toolbox, lessonId, answers} = req.body;

        const question = await QuestionModel.findByIdAndUpdate(id, {
            name: name,
            result: result,
            blocksDefault: blocksDefault,
            toolbox: toolbox,
            lesson: lessonId,
            answers: answers,
        });

        res.json({
            result: {
                success: true,
                question: question,
            },
        });
    },
    delete: async (req, res) => {
        const {id} = req?.params;

        await QuestionModel.findByIdAndDelete(id);

        res.json({
            result: {
                success: true,
            },
        });
    },
    getSolve: async (req, res) => {
        const {
            id
        } = req.params;

        const question = await QuestionModel.findById(id);

        const resolution = await ResolutionModel.findOneAndUpdate({
            question: id,
            student: res.locals.currentUser?._id,
        }, {
            $setOnInsert: {
                question: id,
                student: res.locals.currentUser?._id,
                createdBy: res.locals.currentUser?._id,
            },
        }, {
            upsert: true,
            new: true
        });

        const view = `${ViewUtil.getPrefixView(res.locals.currentUser?.type)}/question-solve.page.ejs`;
        res.render(view, ViewUtil.getOptions({
            data: {
                question: question,
                resolution: resolution,
            },
        }));
    },
    putSolve: async (req, res) => {
        const {
            content,
        } = req.body;
        const {
            id,
        } = req.params;

        const resolution = await ResolutionModel.findOneAndUpdate({
            question: id,
            createdBy: res.locals.currentUser?._id,
        }, {
            content: content,
            solvedAt: new Date(),
        });

        const question = await QuestionModel.findById(id);

        const notification = await NotificationModel.create({
            type: Type.RESOLUTION_SUBMIT,
            content: {
                resolutionId: resolution?._id?.toString(),
                title: NotificationService.generateTitle({
                    type: Type.RESOLUTION_SUBMIT,
                }),
                text: NotificationService.generateText({
                    type: Type.RESOLUTION_SUBMIT,
                    student: res.locals.currentUser,
                    question: question,
                })
            },
            status: Status.NEW,
            receivers: [question.createdBy],
        });


        const socket = req.app.get('socket');
        socket.to(question.createdBy?.toString()).emit('notification', notification);

        res.redirect(`/questions/${id}`);
    },
    getAnswers: async (req, res) => {
        const {
            id,
        } = req.params;

        const newId = new mongoose.Types.ObjectId();
        const answers = await AnswerModel.find({
            question: id,
        });

        const view = `${ViewUtil.getPrefixView(res.locals.currentUser?.type)}/answer.page.ejs`;
        res.render(view, ViewUtil.getOptions({
            data: {
                questionId: id,
                answers: answers,
                newId: newId,
            },
        }));
    },
    getAnswer: async (req, res) => {
        const {
            answerId,
            id,
        } = req.params;

        const answer = await AnswerModel.findById(answerId) || {};

        const view = `${ViewUtil.getPrefixView(res.locals.currentUser?.type)}/answer-detail.page.ejs`;
        res.render(view, ViewUtil.getOptions({
            data: {
                answer: answer,
                questionId: id,
            },
        }));
    },
    getAssign: async (req, res) => {
        const {
            id,
        } = req.params;

        const resolutions = await ResolutionModel.find({
            question: id,
        }).lean();
        const resolutionStudentIdSet = new Set(resolutions.map(resolution => resolution.student?.toString()));

        const students = await UserModel.find({
            type: AuthUtil.UserType.Student,
        }).lean();

        const studentsGroupByAssign = students.reduce((result, student) => {
            const clone = structuredClone(result);

            if (resolutionStudentIdSet.has(student._id?.toString())) {
                clone.studentAssign = [
                    ...clone.studentAssign,
                    {
                        ...student,
                        id: student._id?.toString(),
                    },
                ];
            } else {
                clone.studentNotAssign = [
                    ...clone.studentNotAssign,
                    {
                        ...student,
                        id: student._id?.toString(),
                    },
                ]
            }

            return clone;
        }, {
            studentAssign: [],
            studentNotAssign: [],
        })

        const view = `${ViewUtil.getPrefixView(res.locals.currentUser?.type)}/question-assign.page.ejs`;
        res.render(view, ViewUtil.getOptions({
            data: {
                id: id,
                studentAssign: studentsGroupByAssign.studentAssign,
                studentNotAssign: studentsGroupByAssign.studentNotAssign,
            },
        }));
    },
};

export default {
    get: controllers.get,
    getDetail: controllers.getDetail,
    post: controllers.post,
    put: controllers.put,
    delete: controllers.delete,
    getSolve: controllers.getSolve,
    putSolve: controllers.putSolve,
    getAnswers: controllers.getAnswers,
    getAnswer: controllers.getAnswer,
    getAssign: controllers.getAssign,
}