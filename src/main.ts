import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as dotenv from 'dotenv' 
import * as process from 'process' 
import * as cookieParser from 'cookie-parser';
import { hostname } from 'os';


dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const corsOptions: CorsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  app.enableCors(corsOptions);

  const config = new DocumentBuilder()
    .setTitle('NestJS CRUD with Swagger')
    .setDescription('API documentation for the NestJS CRUD application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  document.security = [{ bearerAuth: [] }];
  SwaggerModule.setup('api', app, document,{
    customSiteTitle: 'Sua API',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(3001);
}
bootstrap();
