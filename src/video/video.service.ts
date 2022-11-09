import { Injectable } from '@nestjs/common';
import { VideoEntity } from './entity/video.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  FindOptionsWhere,
  FindOptionsWhereProperty,
  ILike,
  MoreThan,
  Repository
} from 'typeorm';
import { UpdateVideoDto } from './dto/update-video.dto';
import { JwtPayload } from 'src/auth/types/auth.types';
import { CreateVideoDto } from './dto/create-video.dto';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>
  ) {}

  // Get Most Popular Video
  async getMostPopularVideoByViews() {
    return this.videoRepository.find({
      where: {
        views: MoreThan(0)
      },
      relations: {
        user: true
      },
      select: {
        user: {
          id: true,
          name: true,
          avatarPath: true,
          isVerified: true
        }
      },
      order: {
        views: -1
      }
    });
  }

  // Get All Videos
  async getAllVideos(searchTerm?: string) {
    let options: FindOptionsWhereProperty<VideoEntity> = {};
    if (searchTerm) {
      options = {
        name: ILike(`%${searchTerm}%`)
      };
      return this.videoRepository.find({
        where: {
          ...options,
          isPublic: true
        },
        order: {
          createdAt: 'DESC'
        },
        relations: {
          user: true,
          comments: {
            user: true
          }
        },
        select: {
          user: {
            id: true,
            name: true,
            avatarPath: true,
            isVerified: true
          }
        }
      });
    }
    return await this.videoRepository.find({
      relations: {
        user: true,
        comments: {
          user: true
        }
      },
      select: {
        user: {
          id: true,
          name: true,
          avatarPath: true,
          isVerified: true
        }
      }
    });
  }

  // Update Video
  async updateVideo(id: number, dto: UpdateVideoDto): Promise<VideoEntity> {
    const video = await this.getVideoById(id);
    const updatedVideo = { ...video, ...dto };
    return await this.videoRepository.save(updatedVideo);
  }

  // Create Video
  async createVideo(user: JwtPayload, dto: CreateVideoDto): Promise<number> {
    const defaultValues: CreateVideoDto = {
      name: '',
      description: '',
      user: { id: user.id },
      thumbnailPath: '',
      videoPath: '',
      isPublic: false
    };

    const newVideo = this.videoRepository.create(defaultValues);
    const video = await this.videoRepository.save(newVideo);
    return video.id;
  }

  // Delete Video
  async deleteVideo(id: number): Promise<DeleteResult> {
    return await this.videoRepository.delete({ id });
  }

  // Update Views Counter
  async updateViewsCount(id: number): Promise<VideoEntity> {
    const video = await this.getVideoById(id);
    video.views++;
    return await this.videoRepository.save(video);
  }

  //Update Likes Counter
  async updateLikesCount(id: number): Promise<VideoEntity> {
    const video = await this.getVideoById(id);
    video.likes++;
    return await this.videoRepository.save(video);
  }

  // Get By Id
  async getVideoById(id: number, isPublic = false): Promise<VideoEntity> {
    const video = await this.videoRepository.findOne({
      where: isPublic ? { id, isPublic: true } : { id },
      relations: {
        user: true,
        comments: {
          user: true
        }
      },
      select: {
        user: {
          id: true,
          name: true,
          avatarPath: true,
          isVerified: true,
          subscribersCount: true,
          subscriptions: true
        },
        comments: {
          message: true,
          id: true,
          user: {
            id: true,
            name: true,
            avatarPath: true,
            isVerified: true,
            subscribersCount: true
          }
        }
      }
    });
    return video;
  }
}
