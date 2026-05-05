import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegramService } from '../telegram/telegram.service';
import type { JiraWebhookPayload } from './dto/jira-webhook.dto';

@Injectable()
export class JiraService {
  constructor(
    private readonly config: ConfigService,
    private readonly telegramService: TelegramService,
  ) {}

  async processEvent(payload: JiraWebhookPayload) {
    const event = payload.webhookEvent;

    if (!['jira:issue_updated', 'jira:issue_created'].includes(event)) return;

    const issue = payload.issue;
    const changelog = payload.changelog;

    const issueKey = issue?.key ?? '—';
    const issueSummary = issue?.fields?.summary ?? '—';
    const assignee = issue?.fields?.assignee?.displayName ?? 'Не призначено';

    let message = `🔔 <b>Jira Update</b>\n\n`;
    message += `📌 <b>Задача:</b> ${issueKey} — ${issueSummary}\n`;
    message += `👤 <b>Виконавець:</b> ${assignee}\n`;

    if (changelog?.items?.length) {
      message += `\n📝 <b>Зміни:</b>\n`;

      for (const item of changelog.items) {
        const field = item.field;
        const from = item.fromString ?? '—';
        const to = item.toString ?? '—';

        if (field === 'status') {
          message += `  • Статус: <i>${from}</i> → <b>${to}</b>\n`;
        } else if (field === 'summary') {
          message += `  • Назва: <i>${from}</i> → <b>${to}</b>\n`;
        } else if (field === 'assignee') {
          message += `  • Виконавець: <i>${from}</i> → <b>${to}</b>\n`;
        } else {
          message += `  • ${field}: ${from} → ${to}\n`;
        }
      }
    }

    const chatId = this.config.get<string>('chat_id') ?? '';
    await this.telegramService.sendMessage(chatId, message);
  }
}
