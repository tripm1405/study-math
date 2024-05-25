import express from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import { dirname } from 'path';
import {fileURLToPath} from 'url';
import dotenv from "dotenv";
import mongoose from "mongoose";
import multer from 'multer';

import Router from '#root/routes/index.js';

dotenv.config();

try {
  await mongoose.connect(process.env.DB_SERVER);
}
catch {
  console.log('connect database error');
}


const PORT = process.env.PORT || 5500;

const app = express();

const rootPath = dirname(fileURLToPath(import.meta.url));

app.set('views', `${rootPath}/views`);
app.set('view engine', 'ejs');

app.use(express.static(`${rootPath}/public`));
app.use(expressEjsLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer({ dest: 'uploads/' }).array());

app.use(Router);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});