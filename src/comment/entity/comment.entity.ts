import { UserEntity } from 'src/user/entity/user.entity';
import { Base } from 'src/utils/base';
import { VideoEntity } from 'src/video/entity/video.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'comment' })
export class CommentEntity extends Base {
  @Column({ type: 'text' })
  message: string;

  @ManyToOne(() => UserEntity, user => user.comments)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => VideoEntity, video => video.comments)
  @JoinColumn({ name: 'video_id' })
  video: VideoEntity;
}
