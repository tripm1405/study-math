import mongoose from "mongoose";
import ViewUtil from "#root/utils/view.util.js";
import QuestionModel from "#root/models/question.model.js";
import AuthUtil from "#root/utils/auth.util.js";
import CourseModel from "#root/models/course.model.js";
import LessonModel from "#root/models/lesson.model.js";
import BlockModel from "#root/models/block.model.js";
import ResolutionModel from "#root/models/resolution.model.js";

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

    const prefixView = ViewUtil.getPrefixView(res.locals.currentUser?.type);
    res.render(`${prefixView}/question.page.ejs`, ViewUtil.getOptions({
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
    }))
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
}