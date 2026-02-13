import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('School API')
    .setDescription('API for managing school data')
    .setVersion('1.0')
    .addTag('school')
    .addBearerAuth()
    .build();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
