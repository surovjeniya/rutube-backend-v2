import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/guard/auth.guard';

import { JwtPayload } from 'src/auth/types/auth.types';
import { MediaService } from 'src/media/media.service';
import { User } from 'src/user/decorator/user.decorator';
import { VIDEO_NOT_FOUND } from './const/video.const';

import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { VideoService } from './video.service';
import { UploadFolderPrefix } from '../media/conts/media.cont';

@Controller('video')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly mediaService: MediaService
  ) {}

  // Create Video
  @Post()
  @UseGuards(new AuthGuard())
  async createVideo(@Body() dto: CreateVideoDto, @User() user: JwtPayload) {
    const video = await this.videoService.createVideo(user, dto);
    return video;
  }

  @Get('get-private/:id')
  async getPrivateVideo(@Param('id') id: string) {
    const video = await this.videoService.getVideoById(Number(id), true);
    return video;
  }

  // Get All Videos
  @Get()
  async getAllVideos(@Query('searchTerm') searchTerm?: string) {
    const videos = await this.videoService.getAllVideos(searchTerm);
    return videos;
  }

  // Get Most Popular
  @Get('most-popular')
  async getMostPopularVideoByViews() {
    const videos = await this.videoService.getMostPopularVideoByViews();
    return videos;
  }

  // Get Video By Id
  @Get('get-by-id/:id')
  async getVideoById(@Param('id') id: string) {
    const video = await this.videoService.getVideoById(Number(id));
    if (!video) {
      throw new HttpException(VIDEO_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return video;
  }

  // Update Video
  @Patch('update-video/:id')
  @UseGuards(new AuthGuard())
  async updateVideo(@Param('id') id: string, @Body() dto: UpdateVideoDto) {
    return await this.videoService.updateVideo(Number(id), dto);
  }

  //Delete Video
  @Delete(':id')
  async deleteVideo(@Param('id') id: string) {
    const deletedVideo = await this.videoService.deleteVideo(Number(id));
    if (deletedVideo.affected > 0) {
      return {
        message: 'Video will be deleted'
      };
    } else {
      throw new HttpException(VIDEO_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  //Update Views
  @Put('update-views/:id')
  async updateViewsCount(@Param('id') id: string) {
    const updatedViewsVideo = await this.videoService.updateViewsCount(
      Number(id)
    );
    return updatedViewsVideo;
  }

  //Update Likes
  @Put('update-like/:id')
  @UseGuards(new AuthGuard())
  async updateLikesCount(@User() user: JwtPayload, @Param('id') id: string) {
    return await this.videoService.updateLikesCount(Number(id));
  }

  // Upload Thumbnail
  @Post('upload-thumbnail/:id')
  @UseGuards(new AuthGuard())
  @UseInterceptors(FileInterceptor('file'))
  async uploadThumbnail(
    @User() user: JwtPayload,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    const uploadedThumbnail = await this.mediaService.saveMedia(
      file,
      user,
      UploadFolderPrefix.THUMBNAIL
    );
    const updatedThumbnail = await this.videoService.updateVideo(Number(id), {
      thumbnailPath: uploadedThumbnail.url
    });
    return updatedThumbnail;
  }

  // Upload Video
  @Post('upload-video/:id')
  @UseGuards(new AuthGuard())
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(
    @User() user: JwtPayload,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    const uploadedVideo = await this.mediaService.saveMedia(
      file,
      user,
      UploadFolderPrefix.VIDEO
    );
    const updatedVideo = await this.videoService.updateVideo(Number(id), {
      videoPath: uploadedVideo.url
    });
    return updatedVideo;
  }
}
