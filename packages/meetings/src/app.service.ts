import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MeetingsService, EagerLoadedInstance } from './meetings/meetings.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @Inject('SLACK_SERVICE') private readonly slackClient: ClientProxy,
    private readonly meetings: MeetingsService
  ) {
  }

  nudge(instance: EagerLoadedInstance): void {
    const { slackChannel, name } = instance.meeting

    this.slackClient.emit('reminders', {
      channel: slackChannel,
      name,
      at: instance.at,
      emcee: instance.emcee,
      scribe: instance.scribe,
      agenda: instance.agendaUrl
    })
  }

  async sendDailyReminders() {
    const instances = await this.meetings.today()

    for (const instance of instances) {
      this.nudge(instance)
    }

    this.logger.log({
      event: 'dailyRemindersSent',
      instances: instances.length
    })
  }
}
