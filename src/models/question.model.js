import mongoose from "mongoose";
import ModelNameConstant from "#root/models/model-name.constant.js";

const schema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
  },
  result: {
    type: String,
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNameConstant.LESSON,
  },
  answerIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNameConstant.ANSWER,
  }],
  createdByIs: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNameConstant.USER,
  },
}, {
  timestamps: true,
});

export default mongoose.model(ModelNameConstant.ANSWER, schema);