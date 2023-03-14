import { Injectable, Inject } from '@nestjs/common';
import { ActionRepository } from './action.repository';
import { ActionDTO } from './action.dto';
import { getJSONResult, JSONResult } from '../../utils/result';
@Injectable()
export class ActionService {
  constructor(
    @Inject(ActionRepository)
    private readonly actionRepository: ActionRepository,
  ) {}

  addOne(actionDTO: ActionDTO) {
    return getJSONResult(async (res) => {
      const [results, metadata] = await this.actionRepository.insertOne(
        actionDTO,
      );
      res.data = metadata;
    });
  }

  updateOne(actionDTO: ActionDTO) {
    return getJSONResult(async (res) => {
      const [results, metadata] = await this.actionRepository.updateOne(
        actionDTO,
      );
      res.data = metadata;
    });
  }

  async updateOneCount(actionDTO: ActionDTO) {
    try {
      const resultMap = await this.actionRepository.countOne(
        actionDTO.articleId,
        actionDTO.actionUserId,
      );
      if (resultMap[0].result <= 0) {
        await this.actionRepository.insertOne({
          actionUserId: actionDTO.actionUserId,
          actionLike: 0,
          actionCollect: 0,
          actionLove: 0,
          actionId: null,
          articleId: actionDTO.articleId,
        });
      }
      const result = await this.actionRepository.updateOne(actionDTO);
      return getJSONResult(async (res) => {
        const result2 = await this.actionRepository.findArticleActions(
          actionDTO.articleId,
          actionDTO.actionUserId,
        );
        result2.length
          ? (res.data = result2[0])
          : (res.data = { likes: 0, loves: 0, collects: 0 });
      });
    } catch (err) {
      return JSONResult(500, null, err);
    }
  }

  async queryUserAction(articleId: number, actionUserId: number) {
    try {
      const resultMap = await this.actionRepository.countOne(
        articleId,
        actionUserId,
      );
      if (resultMap[0].result > 0) {
        return getJSONResult(async (res) => {
          const result = await this.actionRepository.findArticleActions(
            articleId,
            actionUserId,
          );
          result.length
            ? (res.data = result[0])
            : (res.data = { likes: 0, loves: 0, collects: 0 });
        });
      } else {
        await this.actionRepository.insertOne({
          actionUserId: actionUserId,
          actionLike: 0,
          actionCollect: 0,
          actionLove: 0,
          actionId: null,
          articleId: articleId,
        });
        return getJSONResult(async (res) => {
          const result = await this.actionRepository.findArticleActions(
            articleId,
            actionUserId,
          );
          res.data = result[0];
        });
      }
    } catch (err) {
      return JSONResult(500, null, err);
    }
  }

  async queryAuthorCount(userId: number) {
    try {
      const counts = await this.actionRepository.staticsAuthorCount(userId);
      return JSONResult(200, counts[0], 'ok');
    } catch (err) {
      return JSONResult(500, null, err);
    }
  }
}
