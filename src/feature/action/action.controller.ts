import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Query,
  Put,
} from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionDTO } from './action.dto';
@Controller('action')
export class ActionController {
  constructor(
    @Inject(ActionService) private readonly actionService: ActionService,
  ) {}

  @Get('/author')
  findAuthorCount(@Query('userId') userId: number) {
    return this.actionService.queryAuthorCount(userId);
  }

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
