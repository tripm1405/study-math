import mongoose from "mongoose";
import ViewUtil from "#root/utils/view.util.js";
import ClassModel from "#root/models/class.model.js";
import UserModel from "#root/models/user.model.js";
import AuthUtil from "#root/utils/auth.util.js";

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
        const { id } = req?.params;
        if (!id) return res.json({
            success: false,
            id: id,
        });

        const _class = await ClassModel.findById(id) || {};
        const users = await UserModel.find({
          type: AuthUtil.UserType.Student,
        });

        res.render('pages/managers/class-detail.page.ejs', ViewUtil.getOptions({
            data: {
                class: _class,
                users: users, 
            },
        }));
    },
    post: async (req, res) => {
        const { code, name, note, userIds } = req.body;

        const _class = await ClassModel.create({
            code: code,
            name: name,
            note: note,
            userIds: userIds,
            createdById: res?.locals?.currentUser?._id,
        });

        res.json({
            result: {
                success: true,
                class: _class,
            },
        });
    },
    put: async (req, res) => {
        const { id } = req?.params;
        const { name, note, userIds } = req.body;

        const newClass = await ClassModel.findByIdAndUpdate(id,{
            name: name,
            note: note,
            userIds: userIds,
        });

        res.json({
            result: {
                success: true,
                _class: newClass,
            },
        });
    },
    delete: async (req, res) => {
        const { id } = req?.params;

        await ClassModel.findByIdAndDelete(id);

        res.json({
            result: {
                success: true,
            },
        });
    },
}