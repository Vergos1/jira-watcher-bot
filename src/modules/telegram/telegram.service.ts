import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { UsersService } from '../users/users.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  public bot: Telegraf;

  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
  ) {
    this.bot = new Telegraf(this.config.get<string>('TELEGRAM_BOT_TOKEN')!);
  }

  onModuleInit() {
    this.bot.command('start', async (ctx) => {
      const tgUser = ctx.from;
      const user = await this.usersService.findOrCreate(tgUser);
      await ctx.reply(
        `Привіт, ${user.firstName}! 👋 Я слідкуватиму за змінами у Jira.`,
      );
    });

    void this.bot.launch();
  }

  async sendMessage(chatId: string | number, text: string) {
    await this.bot.telegram.sendMessage(chatId, text, {
      parse_mode: 'HTML',
    });
  }
}
