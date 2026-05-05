import { Controller, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { TelegramService } from './telegram.service';

@Controller('webhook/telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post()
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    await this.telegramService.bot.handleUpdate(req.body, res);
  }
}
