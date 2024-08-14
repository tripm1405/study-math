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
        require: true,
    },
    type: {
        type: String,
        unique: true,
        require: true,
    },
    color: {
        type: String,
    },
    input: {
        type: String,
        default: ConnectSpecifyType.Empty,
        require: true,
    },
    output: {
        type: String,
        default: ConnectSpecifyType.Empty,
        require: true,
    },
    previousStatement: {
        type: String,
        default: ConnectSpecifyType.Empty,
        require: true,
    },
    nextStatement: {
        type: String, // ['Account']
        default: ConnectSpecifyType.Empty,
        require: true,
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
        require: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model(ModelNameConstant.BLOCK, schema);