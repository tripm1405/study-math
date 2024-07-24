import mongoose from "mongoose";
import ViewUtil from "#root/utils/view.util.js";
import ClassModel from "#root/models/class.model.js";
import UserModel from "#root/models/user.model.js";
import CommonUtil from "#root/utils/common.util.js";
import userModel from "#root/models/user.model.js";
import FilterUtil from "#root/utils/filter.util.js";
import CourseModel from "#root/models/course.model.js";

export default {
    get: async (req, res) => {
        const newId = new mongoose.Types.ObjectId();
        const filter = FilterUtil.Class({
            filters: req.query,
        });
        const classes = await CommonUtil.Pagination.get({
            query: req.query?.classes,
            Model: ClassModel,
            filter: filter,
            extendGet: get => {
                return get
                    .populate('createdBy')
                    .lean();
            },
        });

        const views = 'pages/managers/class.page.ejs';
        res.render(views, ViewUtil.getOptions({
            data: {
                newId: newId,
                classes: {
                    ...classes,
                },
                filters: req.query,
            },
        }));
    },
    getDetail: async (req, res) => {
        const {
            id,
        } = {
            ...req?.params,
        };
        if (!id) {
            res.json({
                success: false,
                id: id,
            });
            return;
        }

        const _class = await ClassModel
            .findById(id) || {};

        const users = await CommonUtil.Pagination.get({
            query: req.query.users,
            Model: UserModel,
            filter: {
                _id: _class.users,
            },
            extendGet: get => {
                return get
                    .populate('createdBy')
                    .lean();
            },
        });

        const userOptions = await UserModel.find({});

        const view = 'pages/managers/class-detail.page.ejs';
        res.render(view, ViewUtil.getOptions({
            data: {
                class: _class,
                userOptions: userOptions,
                users: users,
            },
        }));
    },
    post: async (req, res) => {
        const {code, name, note, userIds} = req.body;

        const classId = new mongoose.Types.ObjectId();
        const _class = await ClassModel.create({
            _id: classId,
            code: code,
            name: name,
            note: note,
            users: userIds,
            createdBy: res?.locals?.currentUser?._id,
        });

        for (const userId of userIds) {
            const classes = (await UserModel.findById(userId)).classes || [];
            await UserModel.findByIdAndUpdate(userId, {
                classes: [...classes, classId],
            });
        }

        res.json({
            result: {
                success: true,
                class: _class,
            },
        });
    },
    put: async (req, res) => {
        const {id} = req?.params;
        const {name, note, userIds} = req.body;

        const newClass = await ClassModel.findByIdAndUpdate(id, {
            name: name,
            note: note,
            users: userIds,
        });

        const users = await UserModel.find({
            classes: id,
        });
        for (const user of users.filter(user => {
            return !userIds.includes(user._id.toString());
        })) {
            await UserModel.findByIdAndUpdate(user._id, {
                classes: (user?.classes || []).filter(classId => {
                    return classId.toString() !== id.toString();
                }),
            });
        }
        for (const userId of userIds.filter(userId => {
            return !users.find(user => {
                return user._id.toString() === userId.toString();
            });
        })) {
            const user = await UserModel.findById(userId);
            const classes = user.classes || [];
            await UserModel.findByIdAndUpdate(userId, {
                classes: [...classes, id],
            });
        }

        res.json({
            result: {
                success: true,
                _class: newClass,
            },
        });
    },
    delete: async (req, res) => {
        const {id} = req?.params;

        await ClassModel.findByIdAndDelete(id);

        res.json({
            result: {
                success: true,
            },
        });
    },
}