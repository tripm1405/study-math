import express from 'express';

import questionApiController from "#root/controllers/apis/question.api.controller.js";
import CommonUtil from "#root/utils/common.util.js";

const Router = express.Router();

Router.post('/:id/assign', questionApiController.assign);
Router.get('/:id/answers/:answerId', questionApiController.getAnswer);
Router.put('/:id/answers/:answerId', questionApiController.putAnswer);
Router.delete('/:id/answers/:answerId', questionApiController.delAnswer);
Router.get('/:id/answers', questionApiController.getAnswers);
Router.post('/:id/answers', CommonUtil.wrapperController(questionApiController.postAnswer));
Router.get('/:id', questionApiController.get);

export default Router;