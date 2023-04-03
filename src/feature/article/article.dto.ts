export class ArticleDTO {
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

export class ArticleParam {
  readonly pageNum: number;
  readonly pageSize: number;
  readonly sortType: string;
  readonly articleTitle: string;
  readonly articleStartDate: string;
  readonly articleEndDate: string;
}
