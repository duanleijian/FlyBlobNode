import { Inject, Injectable } from '@nestjs/common';
import { CommentDTO, CommentParams } from './comment.dto';
import { CommentRepository } from './comment.repository';
import { JSONResult, getJSONResult } from '../../utils//result';
import { paging } from '@/utils/pager';
@Injectable()
export class CommentService {
  constructor(
    @Inject(CommentRepository)
    private readonly commentRepository: CommentRepository,
  ) {}

  addOne(commentDTO: CommentDTO) {
    return getJSONResult(async (res) => {
      const [results, metadata] = await this.commentRepository.insertOne(
        commentDTO,
      );
      res.data = metadata;
    });
  }

  async queryAdminBySort(commentParams: CommentParams) {
    const pager = paging(commentParams.pageNum, commentParams.pageSize);
    try {
      const resultMap = await this.commentRepository.findCount();
      return getJSONResult(async (res) => {
        const list = await this.commentRepository.findCommentAdminBySort({
          ...commentParams,
          pageNum: pager.pageNum,
          pageSize: pager.pageSize,
        });
        res.data = { list, total: resultMap[0].total };
      });
    } catch (err) {
      return JSONResult(500, null, err);
    }
  }

  editStatusAndReply(commentId: number, reply: string, commentStatus: number) {
    return getJSONResult(async (res) => {
      const [results, metadata] =
        await this.commentRepository.updateStatusAndReply(
          commentId,
          reply,
          commentStatus,
        );
      res.data = metadata;
    });
  }

  removeOne(id: number) {
    return getJSONResult(async (res) => {
      const [results, metadata] = await this.commentRepository.deleteOne(id);
      res.data = metadata;
    });
  }

  queryOne(id: number) {
    return getJSONResult(async (res) => {
      const data = await this.commentRepository.findOne(id);
      res.data = data;
    });
  }

  queryAll(id: number) {
    return getJSONResult(async (res) => {
      res.data = await this.commentRepository.findCommentByArticle(id);
    });
  }
}
