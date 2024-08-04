import path from 'path';
import mongoose from "mongoose";

import FileModel from "#root/models/file.model.js";
import {rootPath as publicPath} from "#root/public/index.js";
import fs from "fs";

export default class FileService {
    static read = (props) => {
        const {path, hasRemove} = {
            hasRemove: false,
            ...props,
        };

        const data = fs.readFileSync(path, {
            encoding: 'utf8',
        });

        if (hasRemove) {
            fs.unlink(path, () => {
            });
        }

        return data;
    }

    static create = async (props) => {
        const {files} = props;

        const fileFormats = files.map(file => {
            const id = new mongoose.Types.ObjectId();

            const extend = path.extname(file.originalname);
            const physicalName = `${id}.${extend}`;

            return {
                oldPath: file.path,
                displayName: file.originalname,
                physicalName: physicalName,
                destination: publicPath,
                path: `${publicPath}/${physicalName}`,
            }
        });

        for (const file of files) {
            fs.rename(file?.oldPath, file.path, () => {
            });
        }

        await FileModel.create(fileFormats)

        return true;
    }
}