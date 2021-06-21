import { ScheduleChart } from './schedule.chart';
import { synth } from './__test__';

describe(ScheduleChart, () => {
  describe('with defaults', () => {
    const chart = synth(ScheduleChart)

    it('matches the snapshot', () => {
      expect(chart).toMatchSnapshot()
    })
  })
});
