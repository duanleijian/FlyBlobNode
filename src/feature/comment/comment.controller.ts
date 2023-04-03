import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CommentDTO, CommentParams } from './comment.dto';
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

  @Post('/admin/list')
  getAdminArticleList(@Body() articleParam: CommentParams) {
    return this.commentService.queryAdminBySort(articleParam);
  }

  @Put('/admin/reply')
  updateCommentReply(
    @Body('commentId') commentId: number,
    @Body('commentAcceptance') commentAcceptance: string,
    @Body('commentStatus') commentStatus: number,
  ) {
    return this.commentService.editStatusAndReply(
      commentId,
      commentAcceptance,
      commentStatus,
    );
  }

  @Get('/detail/:id')
  selectOneComment(@Param('id') id: number) {
    return this.commentService.queryOne(id);
  }

  @Delete('/delete/:id')
  removeComment(@Param('id') id: number) {
    return this.commentService.removeOne(id);
  }
}
