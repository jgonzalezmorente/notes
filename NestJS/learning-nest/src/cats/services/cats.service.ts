import { HttpException, HttpStatus, Injectable, NotFoundException, Res } from '@nestjs/common';
import { CatDto, CreateCatDto } from '../dtos';
import * as createError from 'http-errors';
import { CustomException, ForbiddenException } from '../../common/exceptions';

@Injectable()
export class CatsService {

    private _baseUrl: string = '';

    private readonly cats: CatDto[] = [
        {
            id: 1,
            name: 'Duque',
            age: 2,
            breed: 'common'
        },
        {
            id: 2,
            name: 'Nala',
            age: 5,
            breed: 'common'
        }

    ];

    set baseUrl(url: string) {
        this._baseUrl = url;
    }

    findAll(): CatDto[] {
        // throw createError(404, 'Se ha producido un error');
        // throw new NotFoundException('Algo salio mal', { cause: new Error(), description: 'Algo fue mal'});
        return this.cats;
    }

    findById(id: number) {
        const cat = this.cats.find(cat => cat.id === id);
        if (!cat) {
            throw new HttpException(
                `Gato con ${id} no encontrado!!!`,
                HttpStatus.NOT_FOUND,
                {
                    cause: new Error('No encontrado')
                }
            );
        }
        return cat;
    }

    createCat(cat: CreateCatDto): CatDto {
        if (cat.age > 20) {
            throw new ForbiddenException();
        }
        const lastCat = this.cats[this.cats.length - 1];
        const newCat = {
            id: lastCat.id + 1,
            ...cat
        };
        this.cats.push(newCat);
        delete newCat.id
        return newCat;
    }

}
