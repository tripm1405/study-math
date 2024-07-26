import mongoose from "mongoose";
import ViewUtil from "#root/utils/view.util.js";
import LessonModel from "#root/models/lesson.model.js";
import CourseModel from "#root/models/course.model.js";
import AuthUtil from "#root/utils/auth.util.js";
import CommonUtil from "#root/utils/common.util.js";
import ClassModel from "#root/models/class.model.js";
import QuestionModel from "#root/models/question.model.js";
import FilterUtil from "#root/utils/filter.util.js";

export default {
    get: async (req, res) => {
        const newId = new mongoose.Types.ObjectId();
        const filter = FilterUtil.Lesson({
            filters: req.query,
        });
        const lessons = await CommonUtil.Pagination.get({
            query: req.query?.lessons,
            Model: LessonModel,
            filter: filter,
            extendGet: get => {
                return get
                    .populate('createdBy')
                    .lean();
            },
        });

        const view = `${ViewUtil.getPrefixView(res.locals.currentUser?.type)}/lesson.page.ejs`;
        res.render(view, ViewUtil.getOptions({
            data: {
                newId: newId,
                lessons: lessons,
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

        const lesson = await LessonModel.findById(id) 
            .populate('createdBy')|| {};  

        const courses = await CourseModel.find({}) || [];
        const questions = await CommonUtil.Pagination.get({
            query: req.query.questions,
            Model: QuestionModel,
            filter: {lesson: lesson?._id},
            extendGet: get => {
                return get
                    .populate('createdBy')
                    .lean();
            },        
        });

        switch (res.locals.currentUser?.type) {
            default:
            case AuthUtil.UserType.Student: {

                res.render('pages/students/lesson-detail.page.ejs', ViewUtil.getOptions({
                    data: {
                        lesson: lesson,
                        courses: courses,
                        questions: questions
                    },
                }));
                return;
            }
            case AuthUtil.UserType.Admin:
            case AuthUtil.UserType.Teacher: {
                res.render('pages/managers/lesson-detail.page.ejs', ViewUtil.getOptions({
                    data: {
                        lesson: lesson,
                        courses: courses,
                    },
                }));
                return;
            }
        }
    },
    post: async (req, res) => {
        const {code, name, note, courseId} = req.body;

        const lesson = await LessonModel.create({
            code: code,
            name: name,
            note: note,
            course: courseId,
            createdBy: res?.locals?.currentUser?._id,
        });

        res.json({
            result: {
                success: true,
                lesson: lesson,
            },
        });
    },
    put: async (req, res) => {
        const {id} = req?.params;
        const {name, note, courseId} = req.body;

        const newLesson = await LessonModel.findByIdAndUpdate(id, {
            name: name,
            note: note,
            course: courseId,
        });

        res.json({
            result: {
                success: true,
                lesson: newLesson,
            },
        });
    },
    delete: async (req, res) => {
        const {id} = req?.params;

        await LessonModel.findByIdAndDelete(id);

        res.json({
            result: {
                success: true,
            },
        });
    },
}