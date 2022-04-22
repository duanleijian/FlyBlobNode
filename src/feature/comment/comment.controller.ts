import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import CommentDTO from './comment.dto';
import { CommentService } from './comment.service';
@Controller('comment')
export class CommentController {
  constructor(
    @Inject(CommentService) private readonly commentService: CommentService,
  ) {}

  @Post('')
  addComment(@Body() commentDTO: CommentDTO) {
    return this.commentService.addOne(commentDTO);
  }

  @Get('/list')
  selectAllComment(@Query('id') articleId: number) {
    return this.commentService.queryAll(articleId);
  }
}
