import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoEntity } from './entity/video.entity';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [TypeOrmModule.forFeature([VideoEntity]), MediaModule],
  controllers: [VideoController],
  providers: [VideoService]
})
export class VideoModule {}
