export default class ArticleDTO {
  readonly articleId: number;
  readonly userId: number;
  readonly articleTitle: string;
  readonly articleTip: string;
  readonly articleContent: string;
  readonly articleViews: string;
  readonly articleLikes: string;
  readonly articleCollects: number;
  readonly articleComments: number;
  readonly articleLoves: number;
  readonly articleDate: string;
}
