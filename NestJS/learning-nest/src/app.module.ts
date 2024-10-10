import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    CommonModule,
    CatsModule,
    DatabaseModule.forRoot(
      ['UserEntity', 'ProductEntity'],
      { host: 'localhost',  port: 3306 },
    ),
  ],
})
export class AppModule {}
