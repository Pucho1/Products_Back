/* eslint-disable prettier/prettier */
import { Controller, Get, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';

@Controller('hello')
export class HelloController {

  // mala practica usar res directamente porque nest no podra usar interceptores o pipes o filters
  @Get()
  findAll(@Req() request: Request, @Res() response: Response): Response {
    return response.status(200).json({
      message: 'Hello World!'
    });
  } 
}
