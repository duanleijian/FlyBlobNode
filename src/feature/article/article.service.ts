import { Inject, Injectable } from '@nestjs/common';
import sequelize from '../../db/sequelize';
import { ArticleRepository } from './article.repository';
import ArticleDTO from './article.dto';
import { JSONResult, getJSONResult } from '../../utils/result';
import { extractKeyWord } from '../../utils/keyword';
@Injectable()
export class ArticleService {
  constructor(
    @Inject(ArticleRepository)
    private readonly articleRepository: ArticleRepository,
  ) {}
  statisticsArticles(userId: number) {
    return getJSONResult(async (res) => {
      const resultMap = await this.articleRepository.countArticles(userId);
      res.data = resultMap[0].result;
    });
  }
  paging(pageNum: number, pageSize: number) {
    return {
      start: (pageNum - 1) * pageSize,
      pageSize,
    };
  }
  async queryBySort(sortType: string, page: any) {
    try {
      const resultMap = await this.articleRepository.findCount();
      return getJSONResult(async (res) => {
        const list = await this.articleRepository.findBySort(
          sortType,
          this.paging(page.pageNum, page.pageSize),
        );
        res.data = { list, total: resultMap[0].total };
      });
    } catch (err) {
      return JSONResult(500, null, err);
    }
  }
  async queryBySearch(
    keyWord: string,
    sortType: string,
    dateRange: string,
    page: any,
  ) {
    try {
      const resultMap = await this.articleRepository.findCountByKey(keyWord);
      return getJSONResult(async (res) => {
        const list = await this.articleRepository.findBySearch(
          keyWord,
          sortType,
          dateRange,
          this.paging(page.pageNum, page.pageSize),
        );
        res.data = { list, total: resultMap[0].total };
      });
    } catch (err) {
      return JSONResult(500, null, err);
    }
  }
  queryByNearWeek(userId: number) {
    return getJSONResult(async (res) => {
      res.data = await this.articleRepository.findByNearWeek(userId)
    });
  }
  queryByUser(userId: number) {
    return getJSONResult(async (res) => {
      res.data = await this.articleRepository.findByUserId(userId);
    });
  }
  queryByAction(userId: number, type: string) {
    return getJSONResult(async (res) => {
      res.data = await this.articleRepository.findByAction(userId, type);
    });
  }
  queryByAllAction(userId: number) {
    return getJSONResult(async (res) => {
      res.data = await this.articleRepository.findByAllAction(userId);
    });
  }
  queryByRecommend() {
    return getJSONResult(async (res) => {
      res.data = await this.articleRepository.recommendArticle();
    });
  }
  queryOne(id: number) {
    return getJSONResult(async (res) => {
      const list = await this.articleRepository.findOne(id);
      list.length ? (res.data = list[0]) : (res.data = {});
    });
  }
  async queryConcatArticles(id: number) {
    try {
      const results = await this.articleRepository.findOne(id);
      if (results.length) {
        const keys = extractKeyWord(results[0].articleTitle, 2, 4);
        return getJSONResult(async (res) => {
          res.data = await this.articleRepository.findConcatArticles(
            `(${keys.join('|')})`,
          );
        });
      }
    } catch (err) {
      return JSONResult(500, null, err);
    }
  }
  addOne(articleDTO: ArticleDTO) {
    return getJSONResult(async (res) => {
      const [results, metadata] = await this.articleRepository.insertOne(
        articleDTO,
      );
      res.data = metadata;
    });
  }
  editOne(articleDTO: ArticleDTO) {
    return getJSONResult(async (res) => {
      const [results, metadata] = await this.articleRepository.updateOne(
        articleDTO,
      );
      res.data = metadata;
    });
  }
  removeOne(articleId: number) {
    return getJSONResult(async (res) => {
      const [results, metadata] = await this.articleRepository.delArticle(
        articleId,
      );
      res.data = metadata;
    });
  }
  async updateOneAndCount(articleDTO: ArticleDTO) {
    const result = await this.articleRepository.updateOne(articleDTO);
    return getJSONResult(async (res) => {
      const results = await this.articleRepository.findActions(
        articleDTO.articleId,
      );
      res.data = results[0];
    });
  }
  updateArticleViews(id: number) {
    return getJSONResult(async (res) => {
      const [results, metadata] = await this.articleRepository.readNumIncrement(
        id,
      );
      res.data = metadata;
    });
  }
}
