import { CommentEntity } from 'src/comment/entity/comment.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import { Base } from 'src/utils/base';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'video' })
export class VideoEntity extends Base {
  @Column()
  name: string;

  @Column({ default: true, name: 'is_verified' })
  isPublic: boolean;

  @Column({ default: 0 })
  views?: number;

  @Column({ default: 0 })
  likes?: number;

  @Column({ default: 0 })
  duration?: number;

  @Column({ default: '', type: 'text' })
  description: string;

  @Column({ default: '', name: 'video_path' })
  videoPath: string;

  @Column({ default: '', name: 'thumbnail_Path' })
  thumbnailPath: string;

  @ManyToOne(() => UserEntity, user => user.videos)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => CommentEntity, comment => comment.video)
  comments: CommentEntity[];
}
