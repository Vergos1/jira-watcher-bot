import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegramService } from '../telegram/telegram.service';
import type { JiraWebhookPayload } from './dto/jira-webhook.dto';

const FIELD_LABELS: Record<string, string> = {
  status: '🔄 Статус',
  summary: '📝 Назва',
  assignee: '👤 Виконавець',
  priority: '⚡ Пріоритет',
  description: '📄 Опис',
};

const STATUS_EMOJI: Record<string, string> = {
  'To Do': '⬜',
  'In Progress': '🔵',
  'Ready for QA': '🟡',
  Done: '✅',
};

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
    const isNew = event === 'jira:issue_created';

    const issueKey = issue?.key ?? '—';
    const issueSummary = issue?.fields?.summary ?? '—';
    const assignee = issue?.fields?.assignee?.displayName;

    const lines: string[] = [
      `${isNew ? '🆕' : '🔔'} <b>${isNew ? 'Нова задача' : 'Оновлення задачі'}</b>`,
      ``,
      `<b>${issueKey}</b> — ${issueSummary}`,
    ];

    if (assignee) {
      lines.push(`👤 ${assignee}`);
    }

    if (!isNew) {
      const changes = this.parseChangelog(changelog);
      if (changes.length) {
        lines.push(``, `<b>Зміни:</b>`);
        lines.push(...changes);
      }
    }

    const chatId = this.config.get<string>('TELEGRAM_GROUP_CHAT_ID') ?? '';
    await this.telegramService.sendMessage(chatId, lines.join('\n'));
  }

  private parseChangelog(changelog: JiraWebhookPayload['changelog']): string[] {
    if (!changelog?.items?.length) return [];

    return changelog.items
      .filter(({ field }) => field in FIELD_LABELS)
      .map(({ field, fromString, toString }) => {
        const label = FIELD_LABELS[field];
        const from = fromString ?? '—';
        const to = toString ?? '—';

        if (field === 'status') {
          const fromEmoji = STATUS_EMOJI[from] ?? '⬜';
          const toEmoji = STATUS_EMOJI[to] ?? '⬜';
          return `${label}: ${fromEmoji} <i>${from}</i> → ${toEmoji} <b>${to}</b>`;
        }

        if (field === 'assignee') {
          return from === '—'
            ? `  ${label}: <b>${to}</b>`
            : `  ${label}: <i>${from}</i> → <b>${to}</b>`;
        }

        return `  ${label}: <i>${from}</i> → <b>${to}</b>`;
      });
  }
}
