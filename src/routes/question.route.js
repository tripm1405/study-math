import express from 'express';
import questionController from "#root/controllers/question.controller.js";
import CommonUtil from '#root/utils/common.util.js';

const Router = express.Router();

Router.get('/:id/assign', CommonUtil.wrapperController(questionController.getAssign));
Router.get('/:id/answers/:answerId', CommonUtil.wrapperController(questionController.getAnswer));
Router.get('/:id/answers', CommonUtil.wrapperController(questionController.getAnswers));
Router.get('/:id/solve', CommonUtil.wrapperController(questionController.getSolve));
Router.put('/:id/solve', CommonUtil.wrapperController(questionController.putSolve));
Router.get('/:id', CommonUtil.wrapperController(questionController.getDetail));
Router.put('/:id', CommonUtil.wrapperController(questionController.put));
Router.delete('/:id', CommonUtil.wrapperController(questionController.delete));
Router.get('/', CommonUtil.wrapperController(questionController.get));
Router.post('/', CommonUtil.wrapperController(questionController.post));

export default Router;