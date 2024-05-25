import express from 'express';

import classController from "#root/controllers/class.controller.js";

const Router = express.Router();

Router.get('/:id',classController.getDetail);
Router.put('/:id', classController.put);
Router.delete('/:id', classController.delete);
Router.get('/', classController.get);
Router.post('/', classController.post);

export default Router;