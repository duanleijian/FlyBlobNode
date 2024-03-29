/* eslint-disable indent */
/* eslint-disable prettier/prettier */
import {
	Controller,
	Inject,
	Query,
	Get,
	Post,
	Put,
	Body,
	Param,
	Delete
} from '@nestjs/common';
import { ArticleDTO, ArticleParam } from './article.dto';
import { ArticleService } from './article.service';
@Controller('article')
export class ArticleController {
	constructor(@Inject(ArticleService) private readonly articleService: ArticleService) {}

	@Get('/recommend')	
	findRecommendArticles() {		
		return this.articleService.queryByRecommend();
	}

	@Get('/week/list')
	getArticleWeek(@Query('userId') userId: number) {			 					
		return this.articleService.queryByNearWeek(userId)
	}
	
	@Get('/list')
	getArticleList(@Query('pageNum') pageNum:number, @Query('pageSize') pageSize: number, @Query('sort') sortType: string) {			 					
		return this.articleService.queryBySort(sortType, {pageNum: pageNum? pageNum : 1, pageSize: pageSize? pageSize : 7});
	}		

	@Get('/search')
	getSearchArticles(@Query('pageNum') pageNum: number, @Query('pageSize') pageSize: number, @Query('keyword') keyWord: string, @Query('sort') sortType: string, @Query('dateRange') dateRange: string) {
		return this.articleService.queryBySearch(keyWord, sortType, dateRange, {pageNum: pageNum? pageNum : 1, pageSize: pageSize? pageSize : 7});
	}

	@Post('/admin/list')
	getAdminArticleList(@Body() articleParam: ArticleParam) {
		return this.articleService.queryAdminBySort(articleParam);
	}

	@Get('/concat/:id')
	getConcatArticles(@Param('id') id: number) {
		return this.articleService.queryConcatArticles(id);
	}

	@Get('/list/:id')
	getArticlesByUser(@Param('id') userId: number) {		
		return this.articleService.queryByUser(userId);
	}

	@Get('/action/:id/:type')
	getArticlesByAction(@Param('id') userId: number, @Param('type') type: string) {
		if(type.includes('all')) {
			return this.articleService.queryByAllAction(userId)
		} else {
			return this.articleService.queryByAction(userId, type);
		}		
	}

	@Get('/count/:id')
	getArticleCount(@Param('id') userId: number) {
		return this.articleService.statisticsArticles(userId);
	}

	@Post('')
	addArticleInfo(@Body() articleDTO: ArticleDTO) {
		return this.articleService.addOne(articleDTO);
	}	

	@Put('')
	updateArticleInfo(@Body() articleDTO: ArticleDTO) {
		return this.articleService.editOne(articleDTO)
	}

	@Put('/admin/update')
	updateAdminArticleStatus(@Body('articleId') articleId: number, @Body('articleStatus') articleStatus: number) {
		return this.articleService.editOneStatus(articleId, articleStatus);
	}
	
	@Get(':id')
	findOneById(@Param('id') id: number) {		
		return this.articleService.queryOne(id);
	}
	
	@Post('/action')
	findActions(@Body() articleDTO: ArticleDTO) {
		return this.articleService.updateOneAndCount(articleDTO);
	}

	@Get('/views/:id')
	editArticleViews(@Param('id') id: number) {
		return this.articleService.updateArticleViews(id);
	}
	
	@Delete(":id")
	deleteArticle(@Param('id') id: number) {
		return this.articleService.removeOne(id);
	}
}
