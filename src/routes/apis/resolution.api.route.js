import express from 'express';

import resolutionApiController from "#root/controllers/apis/resolution.api.controller.js";

const Router = express.Router();

Router.put('/:id/mark', resolutionApiController.putMark);
Router.put('/mark-by-answer', resolutionApiController.putMarkByAnswer);
Router.get('/solve', resolutionApiController.getSolve);
Router.get('/:id', resolutionApiController.get);

export default Router;