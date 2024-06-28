import mongoose from "mongoose";
import ViewUtil from "#root/utils/view.util.js";
import ClassModel from "#root/models/class.model.js";
import UserModel from "#root/models/user.model.js";
import AuthUtil from "#root/utils/auth.util.js";
import CommonUtil from "#root/utils/common.util.js";
import userModel from "#root/models/user.model.js";

const ITEMS_PER_PAGE = 10;

export default {
    get: async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const classes = await ClassModel.find({})
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);
        const totalClasses = await ClassModel.countDocuments();
        const newId = new mongoose.Types.ObjectId();

        res.render('pages/managers/class.page.ejs', ViewUtil.getOptions({
            data: {
                classes: classes,
                newId: newId,
                currentPage: page,
                totalPages: Math.ceil(totalClasses / ITEMS_PER_PAGE),
            },
        }));
    },
    getDetail: async (req, res) => {
        const {id} = req?.params;
        if (!id) return res.json({
            success: false,
            id: id,
        });

        const _class = await ClassModel
            .findById(id) || {};
        const users = await UserModel.find({
            type: AuthUtil.UserType.Student,
        });

        const {
            page: page,
            totalPages: totalPages,
            models: usersInClass,
        } = await CommonUtil.Pagination.get({
            query: req.query,
            Model: userModel,
            filter: {
                classes: id,
            },
        });

        res.render('pages/managers/class-detail.page.ejs', ViewUtil.getOptions({
            data: {
                class: _class,
                users: users,
                page: page,
                totalPages: totalPages,
                usersInClass: usersInClass,
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
            console.log(user.username);
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
            // const classes = (await UserModel.findById(userId)).classes || [];
            const user = await UserModel.findById(userId);
            const classes = user.classes || [];
            console.log();
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