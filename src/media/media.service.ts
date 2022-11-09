import { Injectable } from '@nestjs/common';
import { JwtPayload } from 'src/auth/types/auth.types';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import { v4 } from 'uuid';
import { UploadFolderPrefix } from './conts/media.cont';
import { UploadFileResponse } from './types/media.type';
@Injectable()
export class MediaService {
  async saveMedia(
    mediafile: Express.Multer.File,
    user: JwtPayload,
    prefix: UploadFolderPrefix
  ): Promise<UploadFileResponse> {
    const uploadFolder = `${path}/uploads/${user.id}/${prefix}`;
    const uploadFileName = v4();
    const uploadFileExt = mediafile.originalname.split('.').slice(-1)[0];
    const uploadFile = `${uploadFileName}.${uploadFileExt}`;

    await ensureDir(uploadFolder);
    await writeFile(`${uploadFolder}/${uploadFile}`, mediafile.buffer);

    return {
      url: `/uploads/${user.id}/${prefix}/${uploadFile}`,
      name: uploadFile
    };
  }
}
