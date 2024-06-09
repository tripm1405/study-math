import express from 'express';

import BlockApiRouter from "#root/routes/apis/block.api.route.js";
import QuestionApiRouter from "#root/routes/apis/question.api.route.js";
import ResolutionApiRouter from "#root/routes/apis/resolution.api.route.js";

const Router = express.Router();

Router.use('/blocks', BlockApiRouter);
Router.use('/questions', QuestionApiRouter);
Router.use('/resolutions', ResolutionApiRouter);

export default Router;