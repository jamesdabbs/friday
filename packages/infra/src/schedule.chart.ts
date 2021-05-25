import { Construct } from "constructs";
import { Chart, ChartProps } from "cdk8s";
import { Deployment, EnvValue, ImagePullPolicy, Service } from "cdk8s-plus-17";
import { envPassthrough, localIngress } from "./util";

export class ScheduleChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = {}) {
    super(scope, id, props);

    const deployment = new Deployment(this, "schedule.deployment", {
      metadata: {
        name: "schedule",
      },
    })

    const secretEnv = envPassthrough("schedule-secret", [
      "GOOGLE_CLIENT_ID",
      "GOOGLE_CLIENT_SECRET",
      "GOOGLE_PERSONAL_REFRESH_TOKEN"
    ])

    deployment.addContainer({
      name: "schedule",
      image: "schedule",
      imagePullPolicy: ImagePullPolicy.IF_NOT_PRESENT,
      env: {
        ...secretEnv,
        GOOGLE_CLIENT_REDIRECT_URI: EnvValue.fromValue("http://localhost:3001/auth/google/callback")
      }
    })

    const service = new Service(this, "schedule.service", {
      metadata: {
        name: "schedule"
      }
    })

    service.addDeployment(deployment, 80, { targetPort: 3000 })

    localIngress(this, service)
  }
}
