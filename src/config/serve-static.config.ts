import { ConfigService } from '@nestjs/config';
import { ServeStaticModuleOptions } from '@nestjs/serve-static';

export const getServeStaticConfig = async (
  configService: ConfigService
): Promise<ServeStaticModuleOptions> => ({});
