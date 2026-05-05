import { Module } from '@nestjs/common';
import { TelegramModule } from '../telegram/telegram.module';
import { JiraController } from './jira.controller';
import { JiraService } from './jira.service';

@Module({
  imports: [TelegramModule],
  controllers: [JiraController],
  providers: [JiraService],
})
export class JiraModule {}
