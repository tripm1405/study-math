import express from 'express';

import blockController from "#root/controllers/block.controller.js";

const Router = express.Router();

Router.get('/:id', blockController.getDetail);
Router.put('/:id', blockController.put);
Router.delete('/:id', blockController.delete);
Router.get('/', blockController.get);
Router.post('/', blockController.post);

export default Router;