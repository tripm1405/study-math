import mongoose from "mongoose";
import ModelNameConstant from "#root/models/model-name.constant.js";

const schema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
  },
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  type: {
    type: String, // ['Admin', 'GiaoVien', 'HocSinh']
  },
  classIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNameConstant.CLASS,
  }],
  createdById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: ModelNameConstant.USER,
  },
}, {
  timestamps: true,
});

export default mongoose.model(ModelNameConstant.USER, schema);