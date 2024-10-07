import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    CommonModule,
    CatsModule,
  ],
})
export class AppModule {}
