import express from 'express';

const Router = express.Router();

Router.get('/', (req, res) => {
  res.json({ result: '/' });
});

Router.post('/', (req, res) => {
  res.json({ result: '/' });
});

Router.put('/', (req, res) => {
  res.json({ result: '/' });
});

Router.delete('/', (req, res) => {
  res.json({ result: '/' });
});

export default Router;