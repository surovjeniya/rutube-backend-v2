import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { CommentEntity } from 'src/comment/entity/comment.entity';
import { VideoEntity } from 'src/video/entity/video.entity';
import { SubscriptionEntity } from './entity/subscription.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      VideoEntity,
      CommentEntity,
      SubscriptionEntity
    ])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
