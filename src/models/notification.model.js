import mongoose from "mongoose";
import ModelNameConstant from "#root/models/model-name.constant.js";

export const Status = {
    NEW: 'New',
    VISITED: 'Visited',
};

export const Type = {
    RESOLUTION_SUBMIT: 'ResolutionSubmit',
};

const schema = new mongoose.Schema({
    type: {
        type: String,
        enum: Object.values(Type),
        required: true,
    },
    content: {
        type: Object,
    },
    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.NEW,
        required: true,
    },
    receivers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: ModelNameConstant.USER,
        required: true,
    }],
}, {
    timestamps: true,
});

export default mongoose.model(ModelNameConstant.NOTIFICATION, schema);