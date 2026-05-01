import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

void bootstrap().catch((err) => {
  console.error('Failed to bootstrap the app', err);
  process.exit(1);
});
