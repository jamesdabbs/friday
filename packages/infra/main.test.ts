import { FridayChart } from './main';
import { Testing } from 'cdk8s';

describe('Placeholder', () => {
  test('with defaults', () => {
    const app = Testing.app();
    const chart = new FridayChart(app, 'test-chart');
    const results = Testing.synth(chart);
    expect(results).toMatchSnapshot();
  });
});
