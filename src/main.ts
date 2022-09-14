import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as express from 'express';
import { join } from 'path';

const KEY_URL = process.env.KEY_URL;
const dev = process.env.NODE_ENV === 'production';

if (dev) {
  const httpsOptions = {
    key: fs.readFileSync(`${KEY_URL}/privkey.pem`, 'utf8'),
    cert: fs.readFileSync(`${KEY_URL}/cert.pem`, 'utf8'),
    ca: fs.readFileSync(`${KEY_URL}/chain.pem`, 'utf8'),
  };

  async function bootstrap() {
    const logger = new Logger();
    const app = await NestFactory.create(AppModule, {
      httpsOptions,
      cors: true,
    });
    app.use('/upload', express.static(join(__dirname, '../upload')));

    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('Meta-Swing')
      .setDescription('Meta-Swing API document')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    await app.listen(process.env.PORT);
    logger.log(`Application running on port: ${process.env.PORT}`);
  }
  bootstrap();
} else {
  async function bootstrap() {
    const logger = new Logger();
    const app = await NestFactory.create(AppModule, {
      cors: true,
    });
    app.use('/upload', express.static(join(__dirname, '../upload')));

    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('Meta-Swing')
      .setDescription('Meta-Swing API document')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    await app.listen(process.env.PORT);
    logger.log(`Application running on port: ${process.env.PORT}`);
  }
  bootstrap();
}
