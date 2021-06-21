import { SlackChart } from './slack.chart';
import { synth } from './__test__';

describe(SlackChart, () => {
  describe('with defaults', () => {
    const chart = synth(SlackChart)

    it('matches the snapshot', () => {
      expect(chart).toMatchSnapshot()
    })
  })
});
