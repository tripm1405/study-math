import dotenv from "dotenv";
import bcrypt from 'bcryptjs';

import ViewUtil from "#root/utils/view.util.js";
import UserModel from "#root/models/user.model.js";
import CourseModel from "#root/models/course.model.js";
import LessonModel from "#root/models/lesson.model.js";
import QuestionModel from "#root/models/question.model.js";

dotenv.config();

export default {
  getHome: async (req, res) => {
    const problems = await QuestionModel.find({});

    res.render('pages/home.page.ejs', ViewUtil.getOptions({
      data: {
        problems: problems,
      },
    }));
  },
  getSearch: async (req, res ) => {
    const { search } = req.query;

    const regex = new RegExp(search, 'i');

    const courses = await CourseModel.find({
      code: {$regex: regex},
    });

    const lessons = await LessonModel.find({
      code: {$regex: regex},
    });

    const problems = await QuestionModel.find({
      code: {$regex: regex},
    });

    res.render('pages/search.page.ejs', ViewUtil.getOptions({
      data: {
        search: search,
        courses: courses,
        lessons: lessons,
        problems: problems,
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
  postSignIn: async (req, res) => {
    const { username, password } = req.body;

    const user = await UserModel.findOne({
      username: username
    });

    if (!user) {
      res.redirect('/sign-in');
      return;
    }

    const isCorrectPassword = await bcrypt.compareSync(password, user?.password);
    if (!isCorrectPassword) {
      res.redirect('/sign-in');
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
    res.redirect('/');
  },
  getSignOut: (req, res) => {
    res.cookie('user', '', {httpOnly: true}, {signed: true});
    res.redirect('/sign-in');
  },
  getNotFound: (req, res) => {
    res.render('pages/not-found.page.ejs', ViewUtil.getOptions({
      layout: false,
    }));
  }
}