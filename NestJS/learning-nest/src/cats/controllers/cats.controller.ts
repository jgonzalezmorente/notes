import { Body, Controller, Get, Header, HttpCode, HttpStatus, Param, ParseIntPipe, ParseUUIDPipe, Post, Query, Redirect, Req, Res, UseFilters } from '@nestjs/common';
import { Response, Request } from 'express';
import { CatsService } from '../services';
import { CatDto, CreateCatDto } from '../dtos';
import { HttpExceptionFilter } from '../../common/filters';

const esperar = async (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

@Controller('cats')
//@UseFilters(HttpExceptionFilter)
export class CatsController {

    constructor(
        private readonly catsService: CatsService
    ) {}

    @Get()
    findAll(): CatDto[] {
        return this.catsService.findAll();
    }

    @Get('express')
    findAllExpress(
        @Res({ passthrough: true }) response: Response,
        @Req() request: Request
    ) {
        //return response.status(200).send({ handlerWithRes: 'handlerWithRes' });
        response.status(201);
        response.setHeader('Custom-Header', 'CustomValue');
        console.log(request);
        const cats = this.catsService.findAll();
        return { path: request.route.path, cats };
    }

    @Get('docs')
    @Redirect('https://docs.nestjs.com', 302)
    getDocs(@Query('version') version: string) {
        if (version && version === '5') {
            return { url: 'https://docs.nestjs.com/v5/' };
        }
    }

    @Get('ab*cd')
    getWithWildcards(@Param('0') wildcards: string) {
        return wildcards;
    }

    @Get('/async')
    async getAsync(@Query('id', new ParseIntPipe({ optional: true })) id?: number): Promise<CatDto[]> {
        // await esperar(2000);
        // return this.findAll();
        return new Promise((resolve, reject) => {
            console.log('Código síncrono');
            setTimeout(() => {
                const cats = this.findAll();
                return resolve(cats);
            }, 3000)
        });
    }

    @Get('/error')
    getError() {
        throw Error('Error no HTTP');
    }

    @Get('/uuid/:uuid')
    getUUID(
        @Param('uuid', new ParseUUIDPipe()) uuid: string
    ) {
        return uuid;
    }

    @Get(':id')
    findById(@Param('id', new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number) {
        console.log({id, type: typeof id });
        return this.catsService.findById(id);
    }

    @Post()
    //@UseFilters(new HttpExceptionFilter())
    //@UseFilters(HttpExceptionFilter)
    @HttpCode(202)
    @Header('Custom-Header-Post', 'custom')
    @Header('Cache-Control', 'none')
    async create(@Body() createCatDto: CreateCatDto) {
        return this.catsService.createCat(createCatDto);
    }
}
