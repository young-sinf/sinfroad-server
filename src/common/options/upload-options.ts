import { BadRequestException } from '@nestjs/common';
import * as multer from 'multer';
import { v4 as uuid } from 'uuid';
import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const multerOptions: MulterOptions = {
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      return cb(null, true);
    }
    return cb(
      new BadRequestException('지원하지 않는 이미지 형식입니다.'),
      false,
    );
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const staticPath = 'static';

      if (!existsSync(staticPath)) {
        mkdirSync(staticPath);
      }

      const uploadPath = join('static', 'public');

      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
      cb(null, generateRandomFilename(file));
    },
  }),
};

function generateRandomFilename(file: Express.Multer.File): string {
  return `${uuid()}${extname(file.originalname)}`;
}
