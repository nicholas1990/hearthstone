import { Controller, Get, Header, Query } from '@nestjs/common';
import { BlizzardService } from './blizzard.service';
import { Card } from './card';

@Controller()
export class CardsController {
  constructor(private readonly blizzard: BlizzardService) {}

  /** `?refresh=1` forza il ricaricamento da Blizzard. */
  @Get('cards')
  @Header('Cache-Control', 'no-store')
  cards(@Query('refresh') refresh?: string): Promise<Card[]> {
    return this.blizzard.cards(refresh === '1');
  }

  @Get('health')
  health() {
    return { ok: true, configured: this.blizzard.configured, cardsSavedAt: this.blizzard.savedAt };
  }
}
