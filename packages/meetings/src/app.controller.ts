import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { MeetingsService } from './meetings/meetings.service';

@Controller()
export class AppController {
  constructor(
    private readonly app: AppService,
    private readonly meetings: MeetingsService
  ) {}

  @Get()
  root() {
    return { ok: true }
  }

  @Get('meetings')
  meetingsToday() {
    return this.meetings.today()
  }

  @Post('sendDailyReminders')
  async sendDailyReminders(): Promise<void> {
    this.app.sendDailyReminders()
  }
}
