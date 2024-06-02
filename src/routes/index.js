import express from 'express';

import TestRouter from '#root/routes/test.route.js';
import ClassRouter from '#root/routes/class.route.js';
import CourseRouter from '#root/routes/course.route.js';
import LessonRouter from '#root/routes/lesson.route.js';
import UserRouter from '#root/routes/user.route.js';
import CommonRoute from "#root/routes/common.route.js";
import BlockRoute from "#root/routes/block.route.js";

const Router = express.Router();

Router.use('/test', TestRouter);
Router.use('/classes', ClassRouter);
Router.use('/courses', CourseRouter);
Router.use('/lessons', LessonRouter);
Router.use('/users', UserRouter);
Router.use('/blocks', BlockRoute);
Router.use('/', CommonRoute);

export default Router;