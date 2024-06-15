import express from 'express';
import lessonController from "#root/controllers/lesson.controller.js";
import CommonUtil from '#root/utils/common.util.js';

const Router = express.Router();

Router.get('/:id', CommonUtil.wrapperController(lessonController.getDetail));
Router.put('/:id', CommonUtil.wrapperController(lessonController.put));
Router.delete('/:id', CommonUtil.wrapperController(lessonController.delete));
Router.get('/', CommonUtil.wrapperController(lessonController.get));
Router.post('/', CommonUtil.wrapperController(lessonController.post));

export default Router;