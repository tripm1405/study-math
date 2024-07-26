import express from 'express';
import MailerService from "#root/services/mailer.service.js";

const Router = express.Router();

Router.get('/', async (req, res) => {
    await MailerService.send({
        email: 'krotohmaki@gmail.com',
        username: 'username',
        password: 'password',
    });

    res.json({result: '/'});
});

Router.post('/', (req, res) => {
    res.json({result: '/'});
});

Router.put('/', (req, res) => {
    res.json({result: '/'});
});

Router.delete('/', (req, res) => {
    res.json({result: '/'});
});

export default Router;