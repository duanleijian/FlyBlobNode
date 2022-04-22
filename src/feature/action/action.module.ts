import { ActionService } from './action.service';
import { ActionController } from './action.controller';
import { ActionRepository } from './action.repository';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [ActionController],
  providers: [ActionService, ActionRepository],
})
export class ActionModule {}
