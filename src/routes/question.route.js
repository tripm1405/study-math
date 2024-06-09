import express from 'express';

import questionController from "#root/controllers/question.controller.js";

const Router = express.Router();

Router.get('/:id', questionController.getDetail);
Router.put('/:id', questionController.put);
Router.delete('/:id', questionController.delete);
Router.get('/', questionController.get);
Router.post('/', questionController.post);

export default Router;