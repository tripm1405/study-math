import mongoose from "mongoose";
import ViewUtil from "#root/utils/view.util.js";
import QuestionModel from "#root/models/question.model.js";
import AuthUtil from "#root/utils/auth.util.js";
import CourseModel from "#root/models/course.model.js";
import LessonModel from "#root/models/lesson.model.js";
import BlockModel from "#root/models/block.model.js";
import ResolutionModel from "#root/models/resolution.model.js";
import AnswerModel from "#root/models/answer.model.js";
import UserModel from "#root/models/user.model.js";

export default {
  get: async (req, res) => {
    const page = parseInt(req?.query?.page) || 1;

    const total = await QuestionModel.countDocuments();
    const paging = ViewUtil.Paging.getPaging({
      total: total,
      currentPage: page,
    });
    const newId = new mongoose.Types.ObjectId();
    const questions = await QuestionModel.find({})
      .skip((page - 1) * paging.pageSize)
      .limit(paging.pageSize);

    const view = `${ViewUtil.getPrefixView(res.locals.currentUser?.type)}/question.page.ejs`;
    res.render(view, ViewUtil.getOptions({
      data: {
        questions: questions,
        newId: newId,
        ...paging,
      },
    }));
  },
  getDetail: async (req, res) => {
    const { id } = req?.params;
    if (!id) return res.json({
      success: false,
      id: id,
    });

    const question = await QuestionModel.findById(id).lean() || {};
    const lessons = await LessonModel.find({});
    const blocks = await BlockModel.find({
      questionId: new mongoose.Types.ObjectId(id),
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
      },
    }));
  },
  post: async (req, res) => {
    const { code, name, result, blocksDefault, toolbox, lessonId, answers } = req.body;

    const question = await QuestionModel.create({
      code: code,
      name: name,
      blocksDefault: blocksDefault,
      toolbox: toolbox,
      result: result,
      lessonId: lessonId,
      answers: answers,
      createdById: res?.locals?.currentUser?._id,
    });

    res.json({
      result: {
        success: true,
        question: question,
      },
    });
  },
  put: async (req, res) => {
    const { id } = req?.params;
    const { name, result, blocksDefault, toolbox, lessonId, answers } = req.body;

    const question = await QuestionModel.findByIdAndUpdate(id,{
      name: name,
      result: result,
      blocksDefault: blocksDefault,
      toolbox: toolbox,
      lessonId: lessonId,
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
    const { id } = req?.params;

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
    const resolution = await ResolutionModel.findOne({
      questionId: id,
      createdById: res.locals.currentUser?._id,
    }) || {};

    const view = `${ViewUtil.getPrefixView(res.locals.currentUser?.type)}/question-solve.page.ejs`;
    res.render(view, ViewUtil.getOptions({
      data: {
        question: question,
        resolution: resolution,
      },
    }));
  },
  postSolve: async (req, res) => {
    const {
      content,
    } = req.body;
    const {
      id
    } = req.params;

    const resolution = ResolutionModel.findOne({
      questionId: id,
      createdById: res.locals.currentUser?._id,
    }) || {};

    if (resolution?._id) {
      await ResolutionModel.findByIdAndUpdate(resolution?._id, {
        content: content,
      });
    }
    else {
      await ResolutionModel.create({
        content: content,
        questionId: id,
        createdById: res.locals.currentUser?._id,
      });
    }

    res.redirect(`/questions/${id}`);
  },
  getAnswers: async (req, res) => {
    const {
      id,
    } = req.params;

    const newId = new mongoose.Types.ObjectId();
    const answers = await AnswerModel.find({
      questionId: id,
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
      questionId: id,
    }).lean();
    const resolutionStudentIdSet = new Set(resolutions.map(resolution => resolution.studentId?.toString()));

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
      }
      else {
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
}