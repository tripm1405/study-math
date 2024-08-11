import express from 'express';

import BlockApiRouter from "#root/routes/apis/block.api.route.js";
import QuestionApiRouter from "#root/routes/apis/question.api.route.js";
import ResolutionApiRouter from "#root/routes/apis/resolution.api.route.js";
import AuthMiddleware from "#root/middlewares/auth.middleware.js";
import NotificationApiRouter from "#root/routes/apis/notification.api.route.js";
import CommonApiRouter from "#root/routes/apis/common.api.route.js";
import UserApiRouter from "#root/routes/apis/user.api.route.js";

const Router = express.Router();

Router.use('/blocks', AuthMiddleware.checkSingedIn, BlockApiRouter);
Router.use('/questions', AuthMiddleware.checkSingedIn, QuestionApiRouter);
Router.use('/resolutions', AuthMiddleware.checkSingedIn, ResolutionApiRouter);
Router.use('/notifications', AuthMiddleware.checkSingedIn, NotificationApiRouter)
Router.use('/users', AuthMiddleware.checkSingedIn, UserApiRouter);
Router.use('/', AuthMiddleware.checkSingedIn, CommonApiRouter);

export default Router;