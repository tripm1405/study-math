import mongoose from "mongoose";

import BlockModel from "#root/models/block.model.js";
import ApiUtil from "#root/utils/api.util.js";
import QuestionModel from "#root/models/question.model.js";
import LessonModel from "#root/models/lesson.model.js";

export default {
  get: async (req, res) => {
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
  }
}