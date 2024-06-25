import dotenv from "dotenv";
import bcrypt from 'bcryptjs';

import ViewUtil from "#root/utils/view.util.js";
import UserModel from "#root/models/user.model.js";
import CourseModel from "#root/models/course.model.js";
import LessonModel from "#root/models/lesson.model.js";
import QuestionModel from "#root/models/question.model.js";
import AuthUtil from "#root/utils/auth.util.js";
import ResolutionModel from "#root/models/resolution.model.js";

dotenv.config();

export default {
  getHome: async (req, res) => {
    const questions = await QuestionModel.find({}).lean();
    const questionMappingById = questions.reduce((result, question) => {
      return {
        ...result,
        [question?._id.toString()]: question,
      }
    }, {});

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

        res.render('pages/home.page.ejs', ViewUtil.getOptions({
          data: {
            questions: resolutionsOrderByAmount
              .map(e => {
                return questionMappingById[e?.id?.toString()];
              })
              .filter(question => Boolean(question)),
          },
        }));

        return;
      }
      case AuthUtil.UserType.Teacher: {
        const resolutions = await ResolutionModel.find({
          score: undefined,
          content: {
            $ne: undefined,
          },
        }).lean();

        res.render('pages/home.page.ejs', ViewUtil.getOptions({
          data: {
            questions: resolutions
              .map(resolution => {
                return questionMappingById[resolution?.question?.toString()];
              })
              .filter(question => Boolean(question)),
          },
        }));

        return;
      }
      case AuthUtil.UserType.Student: {
        const resolutions = await ResolutionModel.find({
          score: undefined,
          content: undefined,
          studentId: res.locals.currentUser?._id,
        });

        res.render('pages/home.page.ejs', ViewUtil.getOptions({
          data: {
            questions: resolutions
              .map(resolution => {
                return questionMappingById[resolution?.question?.toString()];
              })
              .filter(question => Boolean(question)),
          },
        }));

        return;
      }
    }
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

    const regex = new RegExp(search, 'i');

    const courses = await CourseModel.find({
      code: {$regex: regex},
    });

    const lessons = await LessonModel.find({
      code: {$regex: regex},
    });

    const questions = await QuestionModel.find({
      code: {$regex: regex},
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
  postSignIn: async (req, res) => {
    const {username, password} = req.body;

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
  },
  getStatistics: async (req, res) => {
    res.render('pages/statistics.page.ejs', ViewUtil.getOptions({
      data: {},
    }));
  },
}