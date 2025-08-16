import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Family Finance API')
    .setDescription('API documentation for Family Finance Backend')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header',
    }, 'JWT-auth')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

   if (process.env.NODE_ENV === 'export') {
    writeFileSync('./swagger-spec.json', JSON.stringify(document, null, 2));
    console.log('✅ Swagger exported to swagger-spec.json & swagger-spec.yaml');
    await app.close();
    return; // exit after export
  }

  await app.listen(configService.get<number>('PORT') ?? 3000);
}
bootstrap();