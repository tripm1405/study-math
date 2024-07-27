import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import dotenv from "dotenv";

import UserModel from "#root/models/user.model.js";
import ViewUtil from "#root/utils/view.util.js";
import AuthUtil from "#root/utils/auth.util.js";
import ClassModel from "#root/models/class.model.js";
import FilterUtil from "#root/utils/filter.util.js";
import CommonUtil from "#root/utils/common.util.js";
import MailerService, {Type as MailType} from "#root/services/mailer.service.js";

dotenv.config();

export default {
    get: async (req, res) => {
        const filter = FilterUtil.User({
            filters: req.query,
            useDefault: true,
            user: res.locals.currentUser,
        });

        const users = await CommonUtil.Pagination.get({
            query: req.query?.users,
            Model: UserModel,
            filter: filter,
        });

        const newId = new mongoose.Types.ObjectId();

        res.render('pages/managers/user.page.ejs', ViewUtil.getOptions({
            data: {
                filters: req.query,
                users: users,
                newId: newId,
            },
        }));
    },
    getDetail: async (req, res) => {
        const {id} = req?.params;
        if (!id) return res.json({
            success: false,
            id: id,
        });

        const user = await UserModel.findById(id).lean() || {};

        const classFilter = {
            users: user?._id
        };
        const classes = await CommonUtil.Pagination.get({
            query: req.query.classes,
            Model: ClassModel,
            filter: classFilter,
            extendGet: get => {
                return get
                    .populate('createdBy')
                    .lean();
            },        
        });

        res.render('pages/managers/user-detail.page.ejs', ViewUtil.getOptions({
            data: {
                user: user,
                classes: classes,
            },
        }));
    },
    post: async (req, res) => {
        const {code, username, password, fullName, email, type, classIds} = req.body;

        const passwordHash = await bcrypt.hash(password, AuthUtil.BCRYPT_SALT);

        const user = await UserModel.create({
            code: code,
            username: username,
            password: passwordHash,
            fullName: fullName,
            email: email,
            type: type,
            classIds: classIds,
            createdBy: res?.locals?.currentUser?._id,
        });

        await MailerService.send({
            email: email,
            type: MailType.ACCOUNT_LOGIN_INFO,
            content: {
                username: username,
                password: password,
            },
        });

        res.json({
            result: {
                success: true,
                user: user,
            },
        });
    },
    put: async (req, res) => {
        const {id} = req?.params;
        const {username, password, fullName, email, type, classIds} = req.body;

        const newUser = await UserModel.findByIdAndUpdate(id, {
            username: username,
            password: password,
            fullName: fullName,
            email: email,
            type: type,
            classIds: classIds,
        });

        res.json({
            result: {
                success: true,
                user: newUser,
            },
        });
    },
    delete: async (req, res) => {
        const {id} = req?.params;

        await UserModel.findByIdAndDelete(id);

        res.json({
            result: {
                success: true,
            },
        });
    },
}