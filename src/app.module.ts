import { ActionModule } from './feature/action/action.module';
import { CommentModule } from './feature/comment/comment.module';
import { ArticleModule } from './feature/article/article.module';
import { UserModule } from './feature/user/user.module';
import { NoticeModule } from './feature/notice//notice.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
@Module({
  imports: [
    ActionModule,
    CommentModule,
    ArticleModule,
    UserModule,
    NoticeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
