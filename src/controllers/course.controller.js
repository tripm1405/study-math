import ViewUtil from "#root/utils/view.util.js";
import mongoose from "mongoose";
import CourseModel from "#root/models/course.model.js";

export default {
    get: async (req, res) => {
        const courses = await CourseModel.find({});
        const newId = new mongoose.Types.ObjectId();

        res.render('pages/course.page.ejs', ViewUtil.getOptions({
            data: {
                courses: courses,
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

        const course = await CourseModel.findById(id) || {};

        res.render('pages/course-detail.page.ejs', ViewUtil.getOptions({
            data: {
                course: course,
            },
        }));
    },
    post: async (req, res) => {
        const { code, name, note } = req.body;

        const course = await CourseModel.create({
            code: code,
            name: name,
            note: note,
        });

        res.json({
            result: {
                success: true,
                course: course,
            },
        });
    },
    put: async (req, res) => {
        const { id } = req?.params;
        const { name, note } = req.body;

        const newUser = await CourseModel.findByIdAndUpdate(id,{
            name: name,
            note: note,
        });

        res.json({
            result: {
                success: true,
                course: newUser,
            },
        });
    },
    delete: async (req, res) => {
        const { id } = req?.params;

        await CourseModel.findByIdAndDelete(id);

        res.json({
            result: {
                success: true,
            },
        });
    },
}