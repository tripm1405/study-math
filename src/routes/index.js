import express from 'express';

import TestRouter from '#root/routes/test.route.js';
import ApiRouter from '#root/routes/apis/index.js';
import ClassRouter from '#root/routes/class.route.js';
import CourseRouter from '#root/routes/course.route.js';
import LessonRouter from '#root/routes/lesson.route.js';
import UserRouter from '#root/routes/user.route.js';
import CommonRoute from "#root/routes/common.route.js";
import QuestionRouter from "#root/routes/question.route.js";
import BlockRouter from "#root/routes/block.route.js";
import AuthMiddleware from "#root/middlewares/auth.middleware.js";
import ResolutionRouter from "#root/routes/resolution.route.js";

const Router = express.Router();

Router.use('/test', AuthMiddleware.checkSingedIn, TestRouter);
Router.use('/api', ApiRouter);
Router.use('/classes', AuthMiddleware.checkSingedIn, ClassRouter);
Router.use('/courses', AuthMiddleware.checkSingedIn, CourseRouter);
Router.use('/lessons', AuthMiddleware.checkSingedIn, LessonRouter);
Router.use('/questions', AuthMiddleware.checkSingedIn, QuestionRouter);
Router.use('/resolutions', AuthMiddleware.checkSingedIn, ResolutionRouter);
Router.use('/users', AuthMiddleware.checkSingedIn, UserRouter);
Router.use('/blocks', AuthMiddleware.checkSingedIn, BlockRouter);
Router.use('/', CommonRoute);

export default Router;