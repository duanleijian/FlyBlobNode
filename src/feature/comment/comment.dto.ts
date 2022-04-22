export default class CommentDTO {
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
}
