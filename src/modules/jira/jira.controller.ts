import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { JiraService } from './jira.service';

@Controller('webhook/jira')
export class JiraController {
  constructor(private readonly jiraService: JiraService) {}

  @Post()
  @HttpCode(200)
  async handleWebhook(
    @Body()
    payload: {
      webhookEvent: string;
      issue: {
        key: string;
        fields: { summary: string; assignee: { displayName: string } };
      };
      changelog: {
        items: { field: string; fromString: string; toString: string }[];
      };
    },
  ) {
    await this.jiraService.processEvent(payload);
    return { ok: true };
  }
}
