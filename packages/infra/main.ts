import { Construct } from "constructs";
import { App, Chart, ChartProps } from "cdk8s";
import { KafkaChart } from "./src/kafka.chart";
import { SlackChart } from "./src/slack.chart";
import { MeetingsChart } from "./src/meetings.chart";
import { ScheduleChart } from "./src/schedule.chart";
import { MinutesChart } from "./src/minutes.chart";

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = {}) {
    super(scope, id, props);

    const manageKafka = false;
    if (manageKafka) {
      new KafkaChart(this, "kafka.chart");
    }

    new MeetingsChart(this, "meetings.chart", {
      // schedule: "*/1 * * * *"
    });
    new MinutesChart(this, "minutes.chart");
    new ScheduleChart(this, "schedule.chart");
    new SlackChart(this, "slack.chart");
  }
}

const app = new App();
new MyChart(app, "infra");
app.synth();
