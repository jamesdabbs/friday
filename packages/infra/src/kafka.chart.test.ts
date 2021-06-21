import { KafkaChart } from './kafka.chart';
import { synth } from './__test__';

describe(KafkaChart, () => {
  describe('with defaults', () => {
    const chart = synth(KafkaChart)

    it('matches the snapshot', () => {
      expect(chart).toMatchSnapshot()
    })
  })
});
