import mongoose from "mongoose";
import ViewUtil from "#root/utils/view.util.js";
import LessonModel from "#root/models/lesson.model.js";
import CourseModel from "#root/models/course.model.js";

export default {
    get: async (req, res) => {
        const lessons = await LessonModel.find({});
        const newId = new mongoose.Types.ObjectId();

        res.render('pages/lesson.page.ejs', ViewUtil.getOptions({
            data: {
                lessons: lessons,
                newId: newId,
            },
        }));
    },
    getDetail: async (req, res) => {
        const { id } = req?.params;
        if (!id) return res.json({
            success: false,
            id: id,
        });

        const lesson = await LessonModel.findById(id) || {};
        const courses = await CourseModel.find({}) || [];

        res.render('pages/lesson-detail.page.ejs', ViewUtil.getOptions({
            data: {
                lesson: lesson,
                courses: courses,
            },
        }));
    },
    post: async (req, res) => {
        const { code, name, note, courseId } = req.body;

        const lesson = await LessonModel.create({
            code: code,
            name: name,
            note: note,
            courseId: courseId,
        });

        res.json({
            result: {
                success: true,
                lesson: lesson,
            },
        });
    },
    put: async (req, res) => {
        const { id } = req?.params;
        const { name, note, courseId } = req.body;

        const newLesson = await LessonModel.findByIdAndUpdate(id,{
            name: name,
            note: note,
            courseId: courseId,
        });

        res.json({
            result: {
                success: true,
                lesson: newLesson,
            },
        });
    },
    delete: async (req, res) => {
        const { id } = req?.params;

        await LessonModel.findByIdAndDelete(id);

        res.json({
            result: {
                success: true,
            },
        });
    },
}