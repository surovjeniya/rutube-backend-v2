import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'src/auth/types/auth.types';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentEntity } from './entity/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>
  ) {}

  async createComment(
    dto: CreateCommentDto,
    user: JwtPayload,
    video: number
  ): Promise<CommentEntity> {
    const comment: CreateCommentDto = {
      message: '',
      user: { id: user.id },
      video: { id: video }
    };
    const newComment = {
      ...comment,
      ...dto
    };
    return await this.commentRepository.save(newComment);
  }
}
