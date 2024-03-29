import {
  Controller,
  Inject,
  Query,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  Response,
  Delete,
  Headers,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { UserDTO, UserParams } from './user.dto';
// import { createToken, verifyToken } from '../../utils/jwt';
import TokenInterceptor from '../../Interceptor/TokenInterceptor';
import { join } from 'path';
const fs = require('fs');
@Controller('user')
export class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}
  @Get('/list')
  getUserList() {
    return this.userService.queryAllUser();
  }

  @Post('/admin/list')
  getAdminUserList(@Body() userParams: UserParams) {
    return this.userService.queryAdminBySort(userParams);
  }

  @Get('/recommend')
  // @UseInterceptors(TokenInterceptor)
  getRecommendUsers(@Headers() header: any) {
    // console.log('Header', header);
    // if (header['x-token']) {
    //   const isExpire = verifyToken(header['x-token']);
    //   console.log('isExpire', isExpire);
    // }
    return this.userService.queryRecommendAuthor();
  }

  @Get('/concatArticle')
  @UseInterceptors(TokenInterceptor)
  getConcatArticleByUsers() {
    return this.userService.queryUserAndArticle();
  }

  @Delete('/admin/delete/:id')
  removeUser(@Param('id') userId: number) {
    return this.userService.removeOne(userId);
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
  @UseInterceptors(TokenInterceptor)
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
  @UseInterceptors(TokenInterceptor)
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

  @Post('/refresh')
  refreshToken(@Body() body: any) {
    const { authToken, refreshToken } = body;
    return this.userService.refreshAuthToken(authToken, refreshToken);
  }

  @Post('/adminlogin')
  runAdminLogin(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.userService.adminLogin(username, password);
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

  @Post('/upload/large')
  @UseInterceptors(FileInterceptor('chunk'))
  uploadLargeFile(@UploadedFile() file, @Body() body: any) {
    // console.log('file', file);
    // console.log('body', body);
    return this.userService.splitUpload({ ...body, chunk: file.buffer });
  }
  @Get('/upload/check')
  getUploadFiles(
    @Query('fileHash') fileHash: string,
    @Query('total') total: number,
  ) {
    return this.userService.getUploadFileList(fileHash, total);
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
