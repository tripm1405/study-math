import express from 'express';

import TestRouter from './test.route.js';
import ClassRouter from './class.route.js';
import CourseRouter from './course.route.js';
import LessonRouter from './lesson.route.js';
import UserRouter from './user.route.js';
import CommonRoute from "#root/routes/common.route.js";

const Router = express.Router();

Router.use('/test', TestRouter);
Router.use('/classes', ClassRouter);
Router.use('/courses', CourseRouter);
Router.use('/lessons', LessonRouter);
Router.use('/users', UserRouter);
Router.use(CommonRoute);

export default Router;