import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getPostgressConfig } from './config/postgres.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { VideoModule } from './video/video.module';
import { CommentModule } from './comment/comment.module';
import { AuthMiddleware } from './auth/middleware/auth.middleware';
import { MediaModule } from './media/media.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { getServeStaticConfig } from './config/serve-static.config';
import { path } from 'app-root-path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        getPostgressConfig(configService)
    }),
    ServeStaticModule.forRoot({
      rootPath: `${path}/uploads`,
      serveRoot: '/uploads'
    }),
    UserModule,
    AuthModule,
    VideoModule,
    CommentModule,
    MediaModule
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL
    });
  }
}
