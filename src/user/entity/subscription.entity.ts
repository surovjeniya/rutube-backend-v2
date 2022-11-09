import { Base } from 'src/utils/base';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'subscription' })
export class SubscriptionEntity extends Base {
  @ManyToOne(() => UserEntity, user => user.subscriptions)
  @JoinColumn({ name: 'from_user_id' })
  from: UserEntity;

  @ManyToOne(() => UserEntity, user => user.subscribers)
  @JoinColumn({ name: 'to_user_id' })
  to: UserEntity;
}
