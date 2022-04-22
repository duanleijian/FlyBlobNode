import { Inject, Injectable } from '@nestjs/common';
import CommentDTO from './comment.dto';
import { CommentRepository } from './comment.repository';
import { JSONResult, getJSONResult } from '../../utils//result';
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

  queryAll(id: number) {
    return getJSONResult(async (res) => {
      res.data = await this.commentRepository.findCommentByArticle(id);
    });
  }
}
