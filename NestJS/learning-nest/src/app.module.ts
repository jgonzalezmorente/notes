import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { APP_PIPE } from '@nestjs/core';
import { ValidationPipe } from './common/pipes';

@Module({
  imports: [
    CommonModule,
    CatsModule,
    DatabaseModule.forRoot(
      ['UserEntity', 'ProductEntity'],
      { host: 'localhost',  port: 3306 },
    ),
  ],
  providers: [
    // {
    //   provide: APP_PIPE,
    //   useClass: ValidationPipe
    // }
  ]
})
export class AppModule {}
