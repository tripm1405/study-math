import express from 'express';

import userController from "#root/controllers/user.controller.js";

const Router = express.Router();

Router.get('/:id', userController.getDetail);
Router.put('/:id', userController.put);
Router.delete('/:id', userController.delete);
Router.get('/', userController.get);
Router.post('/', userController.post);

export default Router;