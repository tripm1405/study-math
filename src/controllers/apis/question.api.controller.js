import mongoose from "mongoose";

import BlockModel from "#root/models/block.model.js";
import ApiUtil from "#root/utils/api.util.js";
import QuestionModel from "#root/models/question.model.js";
import LessonModel from "#root/models/lesson.model.js";
import AnswerModel from "#root/models/answer.model.js";
import CommonUtil from "#root/utils/common.util.js";
import ResolutionModel from "#root/models/resolution.model.js";

export default {
  get: async (req, res) => {
    const {id} = req?.params;
    if (!id) return res.json({
      success: false,
      id: id,
    });

    const question = await QuestionModel.findById(id).lean() || {};
    const lessons = await LessonModel.find({});
    const blocks = await BlockModel.find({
      question: new mongoose.Types.ObjectId(id),
    });

    res.json(ApiUtil.JsonRes({
      data: {
        question: {
          ...question,
          blocksDefault: JSON.parse(question?.blocksDefault || '{}'),
          toolbox: JSON.parse(question?.toolbox || '{}'),
        },
        blocks: blocks,
        lessons: lessons,
      }
    }));
  },
  getAnswers: async (req, res) => {
    const {
      id
    } = req.params;

    const question = await QuestionModel.findById(id).lean();
    console.log(question);
    const answers = question?.answers || [];

    res.json(ApiUtil.JsonRes({
      data: {
        answers: answers
      }
    }))
  },
  getAnswer: async (req, res) => {
    const {
      answerId,
    } = req.params;

    const answer = await AnswerModel.findById(answerId).lean();

    res.json(ApiUtil.JsonRes({
      data: {
        answer: {
          ...answer,
          content: CommonUtil.jsonParse(answer?.content, {}),
        },
      },
    }))
  },
  postAnswer: async (req, res) => {
    const {
      id,
    } = req.params;
    const {
      code,
      name,
      content,
      score,
      note,
    } = req.body;

    const answer = await AnswerModel.create({
      code: code,
      name: name,
      content: CommonUtil.jsonStringify(content, null),
      score: score,
      note: note,
      question: id,
    });

    res.json(ApiUtil.JsonRes({
      data: {
        answer: answer
      },
    }));
  },
  putAnswer: async (req, res) => {
    const {
      answerId,
    } = req.params;
    const {
      name,
      content,
      score,
      note,
    } = req.body;

    const answer = await AnswerModel.findByIdAndUpdate(answerId, {
      name: name,
      content: CommonUtil.jsonStringify(content, null),
      score: score,
      note: note,
    });

    res.json(ApiUtil.JsonRes({
      data: {
        answer: answer
      },
    }))
  },
  delAnswer: async (req, res) => {
    const {
      answerId,
    } = req.params;

    await AnswerModel.findByIdAndDelete(answerId);

    res.json(ApiUtil.JsonRes());
  },
  assign: async (req, res) => {
    const {
      id,
    } = req.params;
    const {
      studentIds,
    } = {
      studentIds: [],
      ...req.body,
    };

    for (const studentId of studentIds) {
      await ResolutionModel.findOneAndUpdate({
        question: id,
        student: studentId,
      }, {
        $setOnInsert: {
          question: id,
          student: studentId,
          createdBy: res.locals.currentUser?._id,
        },
      }, {
        upsert: true,
        new: true
      });
    }

    res.json(ApiUtil.JsonRes());
  },
}