import { Construct } from "constructs";
import { Chart, ChartProps } from "cdk8s";
import {
  Deployment,
  EnvValue,
  ImagePullPolicy,
} from "cdk8s-plus-17";

export class SlackChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = {}) {
    super(scope, id, props);

    new Deployment(this, "slack.deployment", {
      metadata: {
        name: "slack",
      },
    }).addContainer({
      name: "slack",
      image: "slack",
      imagePullPolicy: ImagePullPolicy.IF_NOT_PRESENT,
      env: {
        SLACK_SIGNING_SECRET: EnvValue.fromSecretValue({
          secret: { name: "slack-secret" },
          key: "SLACK_SIGNING_SECRET",
        }),
        SLACK_BOT_USER_TOKEN: EnvValue.fromSecretValue({
          secret: { name: "slack-secret" },
          key: "SLACK_BOT_USER_TOKEN",
        }),
      },
    });
  }
}
