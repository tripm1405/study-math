import mongoose from "mongoose";
import ViewUtil from "#root/utils/view.util.js";
import LessonModel from "#root/models/lesson.model.js";
import CourseModel from "#root/models/course.model.js";
import AuthUtil from "#root/utils/auth.util.js";

export default {
    get: async (req, res) => {
        const lessons = await LessonModel.find({});
        const newId = new mongoose.Types.ObjectId();

        switch (AuthUtil.currentUser.type) {
            default:
            case AuthUtil.UserType.HocSinh: {
                res.render('pages/students/lesson.page.ejs', ViewUtil.getOptions({
                    data: {
                        lessons: lessons,
                        newId: newId,
                    },
                }));
                return;
            }
            case AuthUtil.UserType.GiaoVien: {
                res.render('pages/lesson.page.ejs', ViewUtil.getOptions({
                    data: {
                        lessons: lessons,
                        newId: newId,
                    },
                }));
                return;
            }
        }
    },
    getDetail: async (req, res) => {
        const { id } = req?.params;
        if (!id) return res.json({
            success: false,
            id: id,
        });

        const lesson = await LessonModel.findById(id) || {};
        const courses = await CourseModel.find({}) || [];

        switch (AuthUtil.currentUser.type) {
            default:
            case AuthUtil.UserType.HocSinh: {
                // get questions

                res.render('pages/students/lesson-detail.page.ejs', ViewUtil.getOptions({
                    data: {
                        lesson: lesson,
                        courses: courses,
                    },
                }));
                return;
            }
            case AuthUtil.UserType.GiaoVien: {
                res.render('pages/lesson-detail.page.ejs', ViewUtil.getOptions({
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