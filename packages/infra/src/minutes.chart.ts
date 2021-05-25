import { Construct } from "constructs";
import { Chart, ChartProps } from "cdk8s";
import { Deployment, ImagePullPolicy, Service } from "cdk8s-plus-17";
import { envPassthrough, localIngress } from "./util";

export class MinutesChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = {}) {
    super(scope, id, props);

    const deployment = new Deployment(this, "minutes.deployment", {
      metadata: {
        name: "minutes",
      }
    })

    deployment.addContainer({
      name: "minutes",
      image: "minutes",
      imagePullPolicy: ImagePullPolicy.IF_NOT_PRESENT,
      // TODO: volume-mount secrets?
      env: envPassthrough("minutes-secret", [
        "CONFLUENCE_EMAIL",
        "CONFLUENCE_API_TOKEN",
        "CONFLUENCE_DOMAIN"
      ])
    })

    const service = new Service(this, "minutes.service", {
      metadata: {
        name: "minutes"
      }
    })

    service.addDeployment(deployment, 80, { targetPort: 3000 })

    localIngress(this, service)
  }
}
