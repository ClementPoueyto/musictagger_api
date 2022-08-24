import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);


  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform:true,   whitelist: true,
  }));

  //SWAGGER
  const configOpenAPI = new DocumentBuilder()
    .setTitle('MusicTagger API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, configOpenAPI);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
