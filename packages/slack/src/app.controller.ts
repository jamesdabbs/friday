import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { DateTime } from 'luxon'

type ReminderMessage = {
  value: {
    channel: string
    at: string
    name: string
    emcee: string
    scribe: string
  }
}

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly app: AppService) {}

  @MessagePattern('reminders')
  sendReminder(
    @Payload() payload: ReminderMessage
  ): void {
    const value = payload.value

    // TODO: better patterns for validation?
    if (!value.name || !value.channel || !value.at) {
      this.logger.debug({
        event: 'sendReminderRejected',
        value
      })
      return
    }

    const at = DateTime.fromISO(value.at)

    this.app.sendReminder({ ...value, at })
  }
}
