import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { format } from 'util';
import { verifyToken } from '../utils/jwt';
import { getJSONResult, JSONResult } from '../utils/result';

@Injectable()
export default class TokenInterceptor implements NestInterceptor {
  private readonly logger = new Logger(); // 实例化日志记录器

  intercept(context: ExecutionContext, next: CallHandler): any {
    // const start = Date.now();
    const host = context.switchToHttp();
    const request = host.getRequest<Request>();
    console.log('request.headers', request.headers);
    const { err, decoded } = verifyToken(request.headers.authorization);
    console.log('err', err);
    console.log('decoded', decoded);
    if (err) {
      return JSONResult(402, null, 'token已过期');
    } else {
      return next.handle();
    }
    // return next.handle().pipe(
    //   tap((response) => {
    //     console.log('response', response);
    //     调用完handle()后得到RxJs响应对象，使用tap可以得到路由函数的返回值
    //     打印请求方法，请求链接，处理时间和响应数据
    //     this.logger.log(
    //       format(
    //         '%s %s %dms %s',
    //         request.method,
    //         request.url,
    //         Date.now() - start,
    //         JSON.stringify(response),
    //       ),
    //     );
    //   }),
    // );
  }
}
