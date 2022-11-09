export class CreateCommentDto {
  message: string;
  video: { id: number };
  user: { id: number };
}
