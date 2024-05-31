import ViewUtil from "#root/utils/view.util.js";
import mongoose from "mongoose";
import CourseModel from "#root/models/course.model.js";
import AuthUtil from "#root/utils/auth.util.js";
import LessonModel from "#root/models/lesson.model.js";

export default {
    get: async (req, res) => {
        const courses = await CourseModel.find({});
        const newId = new mongoose.Types.ObjectId();

        switch (AuthUtil.currentUser.type) {
            default:
            case AuthUtil.UserType.HocSinh: {
                res.render('pages/students/course.page.ejs', ViewUtil.getOptions({
                    data: {
                        courses: courses,
                        newId: newId,
                    },
                }));
                return;
            }
            case AuthUtil.UserType.GiaoVien: {
                res.render('pages/course.page.ejs', ViewUtil.getOptions({
                    data: {
                        courses: courses,
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

        const course = await CourseModel.findById(id) || {};

        switch (AuthUtil.currentUser.type) {
            default:
            case AuthUtil.UserType.HocSinh: {
                const lessons = await LessonModel.find({
                    courseId: course?._id,
                });

                res.render('pages/students/course-detail.page.ejs', ViewUtil.getOptions({
                    data: {
                        course: course,
                        lessons: lessons,
                    },
                }));
                return;
            }
            case AuthUtil.UserType.GiaoVien: {
                res.render('pages/course-detail.page.ejs', ViewUtil.getOptions({
                    data: {
                        course: course,
                    },
                }));
                return;
            }
        }
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