import { MeetingsChart } from './meetings.chart';
import { find, synth } from './__test__';

describe(MeetingsChart, () => {
  function mainContainer(chart: any) {
    const deploy = find(chart, 'Deployment', 'meetings')
    return deploy?.spec?.template?.spec?.containers?.find((c: any) => c.name === 'meetings')
  }

  function cronJob(chart: any) {
    return find(chart, 'CronJob', 'meetings-daily-reminder')
  }

  describe('with defaults', () => {
    const chart = synth(MeetingsChart)

    it('matches the snapshot', () => {
      expect(chart).toMatchSnapshot()
    })

    it('has a liveness probe', () => {
      const container = mainContainer(chart)

      expect(
        container.livenessProbe.httpGet
      ).toBeTruthy()
    })

    it('schedules a job', () => {
      const job = cronJob(chart)
      expect(
        job?.spec?.schedule
      ).toBeTruthy()
    })
  })

  describe('with overridden schedule', () => {
    const chart = synth(MeetingsChart, { schedule: '@hourly' })

    it('uses the provided schedule', () => {
      const job = cronJob(chart)

      expect(
        job?.spec?.schedule
      ).toEqual('@hourly')
    })
  })
});
