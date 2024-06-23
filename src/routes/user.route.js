import express from 'express';
import userController from "#root/controllers/user.controller.js";
import CommonUtil from '#root/utils/common.util.js';

const Router = express.Router();

Router.get('/:id', CommonUtil.wrapperController(userController.getDetail));
Router.put('/:id', CommonUtil.wrapperController(userController.put));
Router.delete('/:id', CommonUtil.wrapperController(userController.delete));
Router.get('/', CommonUtil.wrapperController(userController.get));
Router.post('/', CommonUtil.wrapperController(userController.post));
 
export default Router;