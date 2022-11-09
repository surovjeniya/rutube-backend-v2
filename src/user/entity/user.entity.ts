import { Base } from 'src/utils/base';
import { BeforeInsert, Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { hash } from 'bcryptjs';
import { VideoEntity } from 'src/video/entity/video.entity';
import { CommentEntity } from 'src/comment/entity/comment.entity';
import { SubscriptionEntity } from './subscription.entity';
//import { SubscriptionEntity } from 'src/subscription/entity/subrcription.entity';

@Entity({ name: 'user' })
export class UserEntity extends Base {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 3);
  }

  @Column({ default: '' })
  name: string;

  @Column({ default: false, name: 'is_verified' })
  isVerified: boolean;

  @Column({ default: 0, name: 'subscribers_count' })
  subscribersCount?: number;

  @Column({ default: '', type: 'text' })
  description: string;

  @Column({ default: '', name: 'avatar_path' })
  avatarPath?: string;

  @OneToMany(() => VideoEntity, video => video.user)
  videos: VideoEntity[];

  @OneToMany(() => CommentEntity, comment => comment.user)
  comments: CommentEntity[];

  @OneToOne(() => SubscriptionEntity, subscription => subscription.from)
  subscriptions: SubscriptionEntity[];

  @OneToMany(() => SubscriptionEntity, subscription => subscription.to)
  subscribers: SubscriptionEntity[];
}
