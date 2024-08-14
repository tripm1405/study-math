import mongoose from "mongoose";
import ModelNameConstant from "#root/models/model-name.constant.js";

const schema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    note: {
        type: String,
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ModelNameConstant.QUESTION,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ModelNameConstant.USER,
        required: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model(ModelNameConstant.ANSWER, schema);