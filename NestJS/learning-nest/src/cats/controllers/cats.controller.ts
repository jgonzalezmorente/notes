import { Bind, Body, Controller, DefaultValuePipe, Get, Header, HttpCode, HttpStatus, Param, ParseBoolPipe, ParseUUIDPipe, Post, Query, Redirect, Req, Res, UseFilters, UsePipes } from '@nestjs/common';
import { Response, Request } from 'express';
import { concatMap, delay, from, Observable, of, tap } from 'rxjs';
import { CatsService } from '../services';
import { CatDto, CreateCatDto, createCatSchema } from '../dtos';
import { HttpExceptionFilter } from '../../common/filters';
import { HttpService } from 'src/common/services';
import { CustomHttpClient } from 'src/common/common.module';
import { CustomException } from '../../common/exceptions/custom.exception';
import { ValidationPipe, ZodValidationPipe, ParseIntPipe } from '../../common/pipes';

const esperar = async (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

@Controller('cats')
//@UseFilters(HttpExceptionFilter)
export class CatsController {

    constructor(
        private readonly catsService: CatsService,
        private readonly httpService: HttpService<CustomHttpClient>
    ) {}

    @Get()
    findAll(
        @Query('activeOnly', new DefaultValuePipe(false), ParseBoolPipe) activeOnly: boolean,
        @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,

    ): CatDto[] {
        console.log({activeOnly, page});
        return this.catsService.findAll();
    }

     @Get('/client')
     getClient() {
        const client = this.httpService.getClient();
        return client ? client.request() : 'Cliente HTTP no disponible';
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
    async getAsync(@Query('id', new ParseIntPipe()) id?: number): Promise<CatDto[]> {
        // await esperar(2000);
        // return this.findAll();
        return new Promise((resolve, reject) => {
            console.log('Código síncrono');
            setTimeout(() => {
                const cats = this.findAll(false, 0);
                return resolve(cats);
            }, 3000)
        });
    }

    @Get('/obs')
    getObservable(): Observable<number> {
        return from([1,2,3]).pipe(
            concatMap(value => of(value).pipe(delay(2000))),
            tap(console.log),
        );
    }

    @Get('/error')
    getError() {
        throw Error('Error no HTTP');
    }

    @Get('/custom-error')
    getCustomError() {
        throw new CustomException(404, 'CustomError');
    }

    // @Get('/uuid/:uuid')
    // getUUID(
    //     @Param('uuid', new ParseUUIDPipe()) uuid: string
    // ) {
    //     return uuid;
    // }

    @Get('/uuid/:uuid')
    @Bind(Param('uuid', ParseUUIDPipe))
    getUUId(uuid: string) {
        return uuid;
    }


    @Get('/passthrough')
    passthrough(@Res({ passthrough: true }) res: Response) {
        res.status(HttpStatus.FOUND);
        return {
            ok: true,
            message: 'Obtenido desde passthrough'
        }
    }

    @Get('/set-cookie')
    setCookie(@Res() response: Response) {
      response.cookie('token', '123456789', { httpOnly: true, maxAge: 900000 });
      response.send('Cookie establecida');
    }

    @Get(':id')
    findById(@Param('id', new ParseIntPipe()) id: number) {
        console.log({id, type: typeof id });
        return this.catsService.findById(id);
    }

    @Post()
    // @UseFilters(new HttpExceptionFilter())
    //@UsePipes(new ZodValidationPipe(createCatSchema))
    //@UseFilters(HttpExceptionFilter)
    @HttpCode(202)
    @Header('Custom-Header-Post', 'custom')
    @Header('Cache-Control', 'none')
    async create(@Body() createCatDto: CreateCatDto) {
        return this.catsService.createCat(createCatDto);
    }

    @Post('/create-express')
    createExpress(@Res() res: Response) {
        console.log(res);
        res.status(HttpStatus.OK).json({
            created: true,
            message: 'Creado con express!'
        });
    }



}
