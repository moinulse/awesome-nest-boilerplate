import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserSubscriber } from '../../entity-subscribers/user-subscriber';
import { IAMModule } from '../iam/iam.module';
import { CreateSettingsHandler } from './commands/create-settings.command';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { UserSettingsEntity } from './user-settings.entity';

const handlers = [CreateSettingsHandler];

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserSettingsEntity]),
    forwardRef(() => IAMModule),
  ],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService, UserSubscriber, ...handlers],
})
export class UserModule {}
