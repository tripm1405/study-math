import mongoose from "mongoose";
import ModelNameConstant from "#root/models/model-name.constant.js";

const schema = new mongoose.Schema({
    // === null -> chua lam bai
    content: {
        type: String,
    },
    solvedAt: {
        type: Date,
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
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ModelNameConstant.QUESTION,
        require: true,
    },
    // user.type === Student
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ModelNameConstant.USER,
        require: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ModelNameConstant.USER,
        require: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model(ModelNameConstant.RESOLUTION, schema);