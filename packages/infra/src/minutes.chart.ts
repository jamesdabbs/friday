import { Construct } from "constructs";
import { Chart, ChartProps } from "cdk8s";
import { envPassthrough } from "./util";
import { NestService } from "./NestService";

export class MinutesChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = {}) {
    super(scope, id, props);

    new NestService(this, id, {
      name: "minutes",
      env: envPassthrough("minutes-secret", [
        "CONFLUENCE_EMAIL",
        "CONFLUENCE_API_TOKEN",
        "CONFLUENCE_DOMAIN"
      ]),
    })
  }
}
