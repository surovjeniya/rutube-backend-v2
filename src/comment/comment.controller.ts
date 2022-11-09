import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { JwtPayload } from 'src/auth/types/auth.types';
import { User } from 'src/user/decorator/user.decorator';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':video')
  @UseGuards(new AuthGuard())
  async createComment(
    @Body() dto: CreateCommentDto,
    @User() user: JwtPayload,
    @Param('video') video: string
  ) {
    const comment = await this.commentService.createComment(
      dto,
      user,
      Number(video)
    );

    return comment;
  }
}
