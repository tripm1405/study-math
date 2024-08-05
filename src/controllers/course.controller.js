import mongoose from "mongoose";
import fs from "fs";

import CourseModel from "#root/models/course.model.js";
import LessonModel from "#root/models/lesson.model.js";
import FileModel from "#root/models/file.model.js";
import ViewUtil from "#root/utils/view.util.js";
import CommonUtil from "#root/utils/common.util.js";
import FileUtil from "#root/utils/file.util.js";
import FilterUtil from "#root/utils/filter.util.js";
import ModelUtil from "#root/utils/model.util.js";
import ModelNameConstant from "#root/models/model-name.constant.js";

export default {
    getList: async (req, res) => {
        const newId = new mongoose.Types.ObjectId();
        const filter = FilterUtil.Course({
            filters: req.query,
            user: res.locals.currentUser,
        });
        const courses = await CommonUtil.Pagination.get({
            query: req.query.courses,
            Model: CourseModel,
            filter: {
                $and: [
                    {
                        type: {
                            $ne: 'Admin',
                        },
                    },
                    filter,
                ],
            },
            extendGet: get => {
                return get
                    .populate('createdBy')
                    .lean();
            },
        });

        const view = `${ViewUtil.getPrefixView(res.locals.currentUser?.type)}/course.page.ejs`;
        res.render(view, ViewUtil.getOptions({
            data: {
                courses: courses,
                newId: newId,
                filters: req.query,
            },
        }));
    },
    getDetail: async (req, res) => {
        const {id} = req?.params;
        if (!id) return res.json({
            success: false, id: id,
        });

        const newId = new mongoose.Types.ObjectId();
        const course = await CourseModel.findById(id)
            .populate('createdBy')
            .populate('image') || {};

        const lessons = await CommonUtil.Pagination.get({
            query: req.query.lessons,
            Model: LessonModel,
            filter: {course: course?._id},
            extendGet: get => {
                return get
                    .populate('createdBy')
                    .lean();
            },        
        });
        const view = `${ViewUtil.getPrefixView(res.locals.currentUser?.type)}/course-detail.page.ejs`;
        res.render(view, ViewUtil.getOptions({
            data: {
                course: course,
                lessons: lessons,
                newId: newId,
            },
        }));
    },
    post: async (req, res) => {
        const {name, note} = req.body;
        const imageId = await (async () => {
            const image = (() => {
                const imageFile = req.files?.find(file => file.fieldname === 'image');

                if (!imageFile) {
                    return undefined;
                }

                return FileUtil.format({
                    file: imageFile,
                });
            })();

            if (!image) {
                return undefined;
            }

            fs.rename(image?.oldPath, image.path, () => {
            });

            const imageId = new mongoose.Types.ObjectId();
            await FileModel.create({
                _id: imageId,
                ...image,
            });

            return imageId;
        })();

        const code = await ModelUtil.Code.generate({
            modelName: ModelNameConstant.COURSE,
        })
        const course = await CourseModel.create({
            code: code,
            image: imageId,
            name: name,
            note: note,
            createdBy: res?.locals?.currentUser?._id,
        });

        res.json({
            result: {
                success: true, course: course,
            },
        });
    },
    put: async (req, res) => {
        const {id} = req?.params;
        const {name, note} = req.body;

        const newUser = await CourseModel.findByIdAndUpdate(id, {
            name: name, note: note,
        });

        res.json({
            result: {
                success: true, course: newUser,
            },
        });
    },
    delete: async (req, res) => {
        const {id} = req?.params;

        await CourseModel.findByIdAndDelete(id);

        res.json({
            result: {
                success: true,
            },
        });
    },
}