import express from 'express';
import classController from "#root/controllers/class.controller.js";
import CommonUtil from '#root/utils/common.util.js';

const Router = express.Router();

Router.get('/:id', CommonUtil.wrapperController(classController.getDetail));
Router.put('/:id', CommonUtil.wrapperController(classController.put));
Router.delete('/:id', CommonUtil.wrapperController(classController.delete));
Router.get('/', CommonUtil.wrapperController(classController.get));
Router.post('/', CommonUtil.wrapperController(classController.post));

export default Router;