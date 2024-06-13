import express from 'express';

import resolutionApiController from "#root/controllers/apis/resolution.api.controller.js";

const Router = express.Router();

Router.put('/mark-by-answer', resolutionApiController.putMarkByAnswer);
Router.put('/:id/mark', resolutionApiController.putMark);

export default Router;