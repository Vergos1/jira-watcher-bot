import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import type { JiraWebhookPayload } from './dto/jira-webhook.dto';
import { JiraService } from './jira.service';

@Controller('webhook/jira')
export class JiraController {
  constructor(private readonly jiraService: JiraService) {}

  @Post()
  @HttpCode(200)
  async handleWebhook(
    @Body()
    payload: JiraWebhookPayload,
  ) {
    await this.jiraService.processEvent(payload);
    return { ok: true };
  }
}
