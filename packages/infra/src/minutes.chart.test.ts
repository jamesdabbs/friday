import { MinutesChart } from './minutes.chart';
import { synth } from './__test__';

describe(MinutesChart, () => {
  describe('with defaults', () => {
    const chart = synth(MinutesChart)

    it('matches the snapshot', () => {
      expect(chart).toMatchSnapshot()
    })
  })
});
