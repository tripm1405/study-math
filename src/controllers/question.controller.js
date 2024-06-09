import mongoose from "mongoose";
import ViewUtil from "#root/utils/view.util.js";
import QuestionModel from "#root/models/question.model.js";

export default {
  get: async (req, res) => {
    const questions = await QuestionModel.find({});
    const newId = new mongoose.Types.ObjectId();

    res.render('pages/managers/question.page.ejs', ViewUtil.getOptions({
      data: {
        questions: questions,
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

    const question = await QuestionModel.findById(id) || {};

    res.render('pages/managers/question-detail.page.ejs', ViewUtil.getOptions({
      data: {
        question: question,
      },
    }));
  },
  post: async (req, res) => {
    const { code, name, result, lessonId, answers } = req.body;

    const question = await QuestionModel.create({
      code: code,
      name: name,
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
    const { name, result, lessonId, answers } = req.body;

    const question = await QuestionModel.findByIdAndUpdate(id,{
      name: name,
      result: result,
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
}