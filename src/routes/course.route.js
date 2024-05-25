import express from 'express';

import courseController from "#root/controllers/course.controller.js";

const Router = express.Router();

Router.get('/:id', courseController.getDetail);
Router.put('/:id', courseController.put);
Router.delete('/:id', courseController.delete);
Router.get('/', courseController.get);
Router.post('/', courseController.post);

export default Router;