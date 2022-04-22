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
	Headers,
	Param,
} from '@nestjs/common';
import { threadId } from 'worker_threads';
import ArticleDTO from './article.dto';
import { ArticleService } from './article.service';
@Controller('article')
export class ArticleController {
	constructor(@Inject(ArticleService) private readonly articleService: ArticleService) {}

	@Get('/recommend')	
	findRecommendArticles() {		
		return this.articleService.queryByRecommend();
	}
	
	@Get('/list')
	getArticleList(@Query('pageNum') pageNum:number, @Query('pageSize') pageSize: number, @Query('sort') sortType: string) {			 					
		return this.articleService.queryBySort(sortType, {pageNum: pageNum? pageNum : 1, pageSize: pageSize? pageSize : 7});
	}		

	@Get('/search')
	getSearchArticles(@Query('pageNum') pageNum: number, @Query('pageSize') pageSize: number, @Query('keyword') keyWord: string, @Query('sort') sortType: string, @Query('dateRange') dateRange: string) {
		return this.articleService.queryBySearch(keyWord, sortType, dateRange, {pageNum: pageNum? pageNum : 1, pageSize: pageSize? pageSize : 7});
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
}
