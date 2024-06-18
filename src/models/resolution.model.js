import mongoose from "mongoose";
import ModelNameConstant from "#root/models/model-name.constant.js";

const schema = new mongoose.Schema({
  // === null -> chua lam bai
  content: {
    type: String,
  },
  // === null -> chua cham diem
  score: {
    type: Number,
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNameConstant.USER,
  },
  deadline: {
    type: Date,
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNameConstant.QUESTION,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNameConstant.USER,
  },
  createdById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNameConstant.USER,
  },
}, {
  timestamps: true,
});

export default mongoose.model(ModelNameConstant.RESOLUTION, schema);