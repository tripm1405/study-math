import mongoose from "mongoose";
import ViewUtil from "#root/utils/view.util.js";
import LessonModel from "#root/models/lesson.model.js";
import CourseModel from "#root/models/course.model.js";
import AuthUtil from "#root/utils/auth.util.js";

export default {
  get: async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    const totalLessons = await LessonModel.countDocuments({type: {$ne: 'Admin'}});
    const totalPages = Math.ceil(totalLessons / pageSize);

    const lessons = await LessonModel.find({})
      .populate('createdBy')
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const newId = new mongoose.Types.ObjectId();

    const paginatedLessons = lessons.map((lesson, index) => ({
      ...lesson.toObject(),
      index: (page - 1) * pageSize + index + 1
    }));

    switch (res.locals.currentUser?.type) {
      default:
      case AuthUtil.UserType.Student: {
        res.render('pages/students/lesson.page.ejs', ViewUtil.getOptions({
          data: {
            lessons: lessons,
            totalPages: totalPages,
            currentPage: page,
          },
        }));
        return;
      }
      case AuthUtil.UserType.Admin:
      case AuthUtil.UserType.Teacher: {
        res.render('pages/managers/lesson.page.ejs', ViewUtil.getOptions({
          data: {
            lessons: lessons,
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
    const {id} = req?.params;
    if (!id) return res.json({
      success: false,
      id: id,
    });

    const lesson = await LessonModel.findById(id) || {};
    const courses = await CourseModel.find({}) || [];

    switch (res.locals.currentUser?.type) {
      default:
      case AuthUtil.UserType.Student: {

        res.render('pages/students/lesson-detail.page.ejs', ViewUtil.getOptions({
          data: {
            lesson: lesson,
            courses: courses,
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