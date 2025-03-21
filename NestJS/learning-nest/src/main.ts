import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { AllExceptionsExtendFilter, HttpExceptionFilter } from './common/filters';
import { loggerFun } from './common/middlewares';
import { ValidationPipe } from './common/pipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  //app.useGlobalFilters(new HttpExceptionFilter());

  const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters( new AllExceptionsExtendFilter(httpAdapter));

  app.useGlobalPipes(new ValidationPipe());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(loggerFun);

  await app.listen(3000);
}
bootstrap();
