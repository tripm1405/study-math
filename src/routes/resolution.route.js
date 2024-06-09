import express from 'express';

import resolutionController from "#root/controllers/resolution.controller.js";

const Router = express.Router();

Router.get('/:id', resolutionController.get);
Router.get('/', resolutionController.getList);

export default Router;