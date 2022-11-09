export class CreateVideoDto {
  name: string;
  isPublic?: boolean;
  description: string;
  videoPath: string;
  thumbnailPath: string;
  user?: { id: number };
}
