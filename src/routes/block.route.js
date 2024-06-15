import express from 'express';
import blockController from "#root/controllers/block.controller.js";
import CommonUtil from '#root/utils/common.util.js';

const Router = express.Router();

Router.get('/:id', CommonUtil.wrapperController(blockController.getDetail));
Router.put('/:id', CommonUtil.wrapperController(blockController.put));
Router.delete('/:id', CommonUtil.wrapperController(blockController.delete));
Router.get('/', CommonUtil.wrapperController(blockController.get));
Router.post('/', CommonUtil.wrapperController(blockController.post));

export default Router;