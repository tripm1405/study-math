import mongoose from "mongoose";
import ModelNameConstant from "#root/models/model-name.constant.js";

const schema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: [true, 'Mã không được trống!'],
    },
    name: {
        type: String,
        required: [true, 'Tên không được trống!'],
    },
    content: {
        type: String,
        required: [true, 'Khối không được trống!'],
    },
    score: {
        type: Number,
        required: [true, 'Điểm không được trống!'],
    },
    note: {
        type: String,
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ModelNameConstant.QUESTION,
        required: [true, 'Bài toán không được trống!'],
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ModelNameConstant.USER,
        required: [true, 'Người tạo không được trống!'],
    },
}, {
    timestamps: true,
});

export default mongoose.model(ModelNameConstant.ANSWER, schema);