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
  UseInterceptors,
  UploadedFile,
  Response,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import UserDTO from './user.dto';
import { createToken, verifyToken } from '../../utils/jwt';
import { join } from 'path';
const fs = require('fs');
@Controller('user')
export class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}
  @Get('/list')
  getUserList() {
    return this.userService.queryAllUser();
  }

  @Get('/recommend')
  getRecommendUsers() {
    return this.userService.queryRecommendAuthor();
  }

  @Get('/concatArticle')
  getConcatArticleByUsers() {
    return this.userService.queryUserAndArticle();
  }

  @Post('/email')
  getEmailCode(
    @Body('email') targetEmail: string,
    @Body('userId') userId: number,
  ) {
    return this.userService.sendMail(userId, targetEmail);
  }

  @Post('/verEmail')
  verEmailCode(
    @Body('code') authCode: string,
    @Body('time') timeStamp: number,
  ) {
    return this.userService.verEmail(authCode, timeStamp);
  }

  @Post('/resetPwd')
  resetUserPwd(
    @Body('code') authCode: string,
    @Body('time') timeStamp: number,
    @Body('userPwd') userPwd: string,
  ) {
    return this.userService.resetPwd(authCode, timeStamp, userPwd);
  }

  @Get('/countAuthor/:id')
  getAuthorCounts(@Param('id') id: number) {
    return this.userService.queryAuthorCountById(id);
  }

  @Get('/multiple')
  getUserByIds(@Query('userRelate') userIds: string) {
    return this.userService.queryUserByIds(userIds);
  }

  @Get(':id')
  getUserById(@Param('id') id: number) {
    return this.userService.queryOneById(id);
  }

  @Post('/getInfo')
  getUserInfo(@Headers('Authorization') token) {
    return this.userService.queryOneDetail(token);
  }

  @Put('')
  updateUserInfo(@Body() userDTO: UserDTO) {
    return this.userService.setOne(userDTO);
  }

  @Put('/editRelate')
  updateUserRelate(@Body() userDTO: UserDTO) {
    return this.userService.setOneRelate(userDTO.userId, userDTO.userRelate);
  }

  @Post('/login')
  runLogin(@Body() userDTO: UserDTO) {
    return this.userService.login(userDTO.userName, userDTO.userPwd);
  }

  @Post('/register')
  runRegister(@Body() userDTO: UserDTO) {
    return this.userService.register(userDTO);
  }

  @Post('/relate')
  followUser(@Body('ids') ids: string, @Body('id') id: number) {
    return this.userService.setOneIds(ids, id);
  }

  @Get('/follow/:id')
  getFollowUser(@Param('id') userId: number) {
    return this.userService.statisticsFans(userId);
  }

  @Get('/count/all/:id')
  getAllCount(@Param('id') userId: number) {
    return this.userService.statisticsAllCount(userId);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(@UploadedFile() file, @Body('userId') userId: number) {
    return this.userService.uploadPicture(file, userId);
  }

  @Get('/picture/:filename')
  showUserAvatar(@Param('filename') filename: string, @Response() resp) {
    const fileType = filename.split('.')[1];
    const url = join(__dirname, '..', '../public/upload', filename);
    fs.readFile(url, (err, data) => {
      resp.writeHead(200, { 'Content-Type': `image/${fileType}` });
      resp.end(data);
    });
  }
}
