import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { NoticeDTO, NoticeParams } from './notice.dto';
import { NoticeService } from './notice.service';

@Controller('notice')
export class NoticeController {
  constructor(
    @Inject(NoticeService) private readonly noticeService: NoticeService,
  ) {}

  @Post('/admin/list')
  getAdminNoticeList(@Body() noticeParams: NoticeParams) {
    return this.noticeService.queryAdminBySort(noticeParams);
  }
  @Get('/detail/:id')
  getNoticeDetail(@Param('id') noticeId: number) {
    return this.noticeService.queryOne(noticeId);
  }

  @Put('/status')
  updateNoticeStatus(
    @Body('noticeId') id: number,
    @Body('noticeStatus') status: number,
  ) {
    return this.noticeService.editStatus(id, status);
  }

  @Post('')
  addNotice(@Body() noticeDTO: NoticeDTO) {
    return this.noticeService.addOne(noticeDTO);
  }

  @Put('')
  updateNotice(@Body() noticeDTO: NoticeDTO) {
    return this.noticeService.editOne(noticeDTO);
  }

  @Delete(':id')
  remoceNotice(@Param('id') id: number) {
    return this.noticeService.removeOne(id);
  }
}
