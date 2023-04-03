import { NoticeController } from './notice.constroller';
import { NoticeService } from './notice.service';
import { Module } from '@nestjs/common';
import { NoticeRepository } from './notice.repository';

@Module({
  imports: [],
  controllers: [NoticeController],
  providers: [NoticeService, NoticeRepository],
})
export class NoticeModule {}
