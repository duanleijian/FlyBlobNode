import { Controller, Get, Param, Response } from '@nestjs/common';
import { join } from 'path';
import { AppService } from './app.service';
const fs = require('fs');
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
