import mongoose from "mongoose";
import ModelNameConstant from "#root/models/model-name.constant.js";

const ConnectSpecifyType = {
    Action: 'Action',
    Number: 'Number',
    String: 'String',
    AnyThing: 'Anything',
    Empty: 'Empty',
}

const schema = new mongoose.Schema({
    name: {
        type: String,
    },
    type: {
        type: String,
        unique: true,
    },
    color: {
        type: String,
    },
    input: {
        type: String,
        default: ConnectSpecifyType.Empty,
    },
    output: {
        type: String,
        default: ConnectSpecifyType.Empty,
    },
    previousStatement: {
        type: String,
        default: ConnectSpecifyType.Empty,
    },
    nextStatement: {
        type: String, // ['Account']
        default: ConnectSpecifyType.Empty,
    },
    // {
    //   [`message${Number}`]: String,
    //   [`args{Number}`]: {},
    // }
    substance: {
        type: Object,
    },
    content: {
        type: String,
    },
    tooltip: {
        type: String,
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ModelNameConstant.QUESTION,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: ModelNameConstant.USER,
    },
}, {
    timestamps: true,
});

export default mongoose.model(ModelNameConstant.BLOCK, schema);