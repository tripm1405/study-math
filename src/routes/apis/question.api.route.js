import express from 'express';

import questionApiController from "#root/controllers/apis/question.api.controller.js";

const Router = express.Router();

Router.get('/:id/answers', questionApiController.getAnswers);
Router.get('/:id', questionApiController.get);

export default Router;