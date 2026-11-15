import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BlizzardService } from './blizzard.service';
import { CardsController } from './cards.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [CardsController],
  providers: [BlizzardService],
})
export class AppModule {}
