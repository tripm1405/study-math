import express from 'express';
import courseController from "#root/controllers/course.controller.js";
import CommonUtil from '#root/utils/common.util.js';

const Router = express.Router();

Router.get('/:id', CommonUtil.wrapperController(courseController.getDetail));
Router.put('/:id', CommonUtil.wrapperController(courseController.put));
Router.delete('/:id', CommonUtil.wrapperController(courseController.delete));
Router.get('/', CommonUtil.wrapperController(courseController.get));
Router.post('/', CommonUtil.wrapperController(courseController.post));

export default Router;