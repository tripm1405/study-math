import express from 'express';

import lessonController from "#root/controllers/lesson.controller.js";

const Router = express.Router();

Router.get('/:id', lessonController.getDetail);
Router.put('/:id', lessonController.put);
Router.delete('/:id', lessonController.delete);
Router.get('/', lessonController.get);
Router.post('/', lessonController.post);

export default Router;