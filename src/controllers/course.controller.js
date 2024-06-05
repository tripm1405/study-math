import ViewUtil from "#root/utils/view.util.js";
import mongoose from "mongoose";
import CourseModel from "#root/models/course.model.js";
import AuthUtil from "#root/utils/auth.util.js";
import LessonModel from "#root/models/lesson.model.js";

export default {
    get: async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const totalCourses = await CourseModel.countDocuments({ type: { $ne: 'Admin' } });
        const totalPages = Math.ceil(totalCourses / pageSize);

        const courses = await CourseModel.find({})
        .skip((page - 1) * pageSize)
        .limit(pageSize);

        const paginatedCourses = courses.map((course, index) => ({
            ...course.toObject(),
            index: (page - 1) * pageSize + index + 1
        }));
        const newId = new mongoose.Types.ObjectId();

        switch (res.locals.currentUser?.type) {
            default:
            case AuthUtil.UserType.Student: {
                res.render('pages/students/course.page.ejs', ViewUtil.getOptions({
                    data: {
                        courses: courses,
                        newId: newId,
                        totalPages: totalPages, 
                        currentPage: page,
                    },
                }));
                return;
            }
            case AuthUtil.UserType.Admin:
            case AuthUtil.UserType.Teacher: {
                res.render('pages/course.page.ejs', ViewUtil.getOptions({
                    data: {
                        courses: courses,
                        newId: newId,
                        totalPages: totalPages,
                        currentPage: page,
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

        switch (res.locals.currentUser?.type) {
            default:
            case AuthUtil.UserType.Student: {
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
            case AuthUtil.UserType.Admin:
            case AuthUtil.UserType.Teacher: {
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