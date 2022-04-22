import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionDTO } from './action.dto';
@Controller('action')
export class ActionController {
  constructor(
    @Inject(ActionService) private readonly actionService: ActionService,
  ) {}

  @Get('/count/:articleId/:articleUserId')
  findAction(
    @Param('articleId') articleId: number,
    @Param('articleUserId') articleUserId: number,
  ) {
    return this.actionService.queryUserAction(articleId, articleUserId);
  }

  @Put('')
  updateAction(@Body() actionDTO: ActionDTO) {
    return this.actionService.updateOneCount(actionDTO);
  }
}
