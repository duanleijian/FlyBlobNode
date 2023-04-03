import { Inject, Injectable } from '@nestjs/common';
import { NoticeDTO, NoticeParams } from './notice.dto';
import { NoticeRepository } from './notice.repository';
import { JSONResult, getJSONResult } from '../../utils//result';
import { filterParam, paging } from '@/utils/pager';
@Injectable()
export class NoticeService {
  constructor(
    @Inject(NoticeRepository)
    private readonly noticeRepository: NoticeRepository,
  ) {}

  async queryAdminBySort(noticeParams: NoticeParams) {
    const params = filterParam(noticeParams);
    const pager = paging(noticeParams.pageNum, noticeParams.pageSize);
    try {
      const resultMap = await this.noticeRepository.findCount();
      return getJSONResult(async (res) => {
        const list = await this.noticeRepository.findAdminBySort({
          ...params,
          pageNum: pager.pageNum,
          pageSize: pager.pageSize,
        });
        res.data = { list, total: resultMap[0].total };
      });
    } catch (err) {
      return JSONResult(500, null, err);
    }
  }

  addOne(noticeDTO: NoticeDTO) {
    return getJSONResult(async (res) => {
      const [results, metadata] = await this.noticeRepository.insertOne(
        noticeDTO,
      );
      res.data = metadata;
    });
  }

  queryOne(id: number) {
    return getJSONResult(async (res) => {
      const list = await this.noticeRepository.findOne(id);
      list.length ? (res.data = list[0]) : (res.data = {});
    });
  }

  editStatus(id: number, status: number) {
    return getJSONResult(async (res) => {
      const [results, metadata] = await this.noticeRepository.updateStatus(
        id,
        status,
      );
      res.data = metadata;
    });
  }

  editOne(noticeDTO: NoticeDTO) {
    return getJSONResult(async (res) => {
      const [results, metadata] = await this.noticeRepository.updateOne(
        noticeDTO,
      );
      res.data = metadata;
    });
  }

  removeOne(id: number) {
    return getJSONResult(async (res) => {
      const [results, metadata] = await this.noticeRepository.deleteOne(id);
      res.data = metadata;
    });
  }
}
