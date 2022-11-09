import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'src/auth/types/auth.types';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SubscriptionEntity } from './entity/subscription.entity';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(SubscriptionEntity)
    private readonly subscriptionRepository: Repository<SubscriptionEntity>
  ) {}

  async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create({ ...dto });
    return await this.userRepository.save(user);
  }

  async getUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        comments: true,
        videos: true,
        subscribers: {
          from: true
        },
        subscriptions: {
          to: true
        }
      }
    });
    return user;
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  async updateUser(
    dto: UpdateUserDto,
    { id }: JwtPayload
  ): Promise<UserEntity> {
    const user = await this.getUserById(id);
    const updatedUser = { ...user, ...dto };
    return this.userRepository.save(updatedUser);
  }

  async deleteUser({ id }: JwtPayload) {
    const user = await this.getUserById(id);
    if (!user) {
      return false;
    }
    const deletedUser = await this.userRepository.delete(user.id);
    return deletedUser;
  }

  //getAll
  async getAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }
  //subscribe
  async subscribe(from: number, to: number) {
    const subscriptionData = {
      to: { id: to },
      from: { id: from }
    };

    const isSubscribed = await this.subscriptionRepository.findOneBy(
      subscriptionData
    );

    if (!isSubscribed) {
      const newSubscription =
        this.subscriptionRepository.create(subscriptionData);
      await this.subscriptionRepository.save(newSubscription);
      return true;
    }

    await this.subscriptionRepository.delete(subscriptionData);
    return false;
  }
}
