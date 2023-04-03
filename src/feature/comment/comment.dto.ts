export class CommentDTO {
  readonly commentId: number;
  readonly commentCreaterId: number;
  readonly commentCreater: string;
  readonly commentCreaterProd: string;
  readonly commentCreaterAvatar: string;
  readonly commentReceivcerId: number;
  readonly commentReceivcer: string;
  readonly commentReceivcerAvatar: string;
  readonly commentCont: string;
  readonly articleId: number;
  readonly commentParentId: number;
  readonly commentDate: string;
  readonly commentStatus: number;
}

export class CommentParams {
  readonly pageNum: number;
  readonly pageSize: number;
  readonly sortType: string;
  readonly articleTitle?: string;
  readonly commentCreater?: string;
  readonly commentReceivcer?: string;
  readonly commentCont?: string;
  readonly commentDate?: string;
}
