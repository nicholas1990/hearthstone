import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = Number(process.env.PORT ?? 3000);
  // 0.0.0.0: raggiungibile dal telefono sulla stessa rete Wi-Fi
  await app.listen(port, '0.0.0.0');
  new Logger('Bootstrap').log(`Server in ascolto su http://0.0.0.0:${port}`);
}
void bootstrap();
