import { Inject, Injectable } from '@nestjs/common';
import { Instance, Meeting, Person, PrismaClient } from '@prisma/client'
import { PRISMA_CLIENT } from '@jamesdabbs/nest-platform';

function inHours(n: number) {
  const date = new Date()
  date.setTime(date.getTime() + (n * 60 * 60 * 1000))
  return date
}

export type EagerLoadedInstance = Instance & { meeting: Meeting, emcee: Person, scribe: Person }

const james: Person = { id: 1, slackName: '@james' }
const meetings: Person = { id: 2, slackName: '@meetings' }

const instances: EagerLoadedInstance[] = [
  {
    id: 1,
    meetingId: 1,
    meeting: {
      id: 1,
      name: 'Tech Leads Core',
      slackChannel: '_robots'
    },
    at: inHours(6),
    emceeId: 1,
    emcee: james,
    scribeId: 2,
    scribe: meetings,
    agendaUrl: 'http://example.com'
  }
]

@Injectable()
export class MeetingsService {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async today(): Promise<EagerLoadedInstance[]> {
    const meetings = await this.prisma.instance.findMany({
      include: { meeting: true, emcee: true, scribe: true }
    })

    console.log({ meetings })

    return instances
  }
}
