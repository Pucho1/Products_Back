/* eslint-disable prettier/prettier */
import { Controller, Get, HttpCode, Param, ParseIntPipe, Query, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { RangePipe } from './hello.pipe';

@Controller('hello')
export class HelloController {

  // mala practica usar res directamente porque nest no podra usar interceptores o pipes o filters
  @Get()
  findAll(@Req() request: Request, @Res() response: Response): Response {
    return response.status(200).json({
      message: 'Hello World!'
    });
  }

  // Manejo de errores con codigo personalizado
  @Get('error404')
  @HttpCode(404)
  error404(): string {
    return 'This is a 404 error';
  }

  // Manejo de errores con codigo personalizado
  @Get('error500')
  @HttpCode(500)
  error500(): string {
    return 'This is a 500 error';
  }

  // Manejo de respuestas con codigo personalizado usando el pipeline de NestJS
  @Get('success201')
  @HttpCode(201)
  personalSuccessResponse(): string {
    return 'This is a 201 success response';
  }

  @Get('range')
  getByRange(@Query(RangePipe) query: { start: any; end: any }) {
    console.log(typeof query.start); // string
    console.log(typeof query.end); // string
    return `This is a request with range: ${query.start} - ${query.end}`;
  }

  // Manejo los parametros con un parseo mediante los pipes de nestjs
  // Cambio el tipo de dato del parametro de string a number
  // Hay mas pipes como ParseBoolPipe, ParseArrayPipe, etc.
  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number): string {
    return `This is a request with id: ${id}`;
  }

}
