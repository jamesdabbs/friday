import { Construct } from "constructs";
import {
  ContainerProps,
  Deployment, ImagePullPolicy,
  Probe, Service
} from "cdk8s-plus-17";
import { localIngress } from "./util";

export class NestService extends Construct {
  constructor(scope: Construct, id: string, { env, name, port = 3000, ...props }: {
    name: string
    port?: number
    env: ContainerProps['env'];
  }) {
    super(scope, `${id}.nest`, props);

    const deployment = new Deployment(this, `${name}.deployment`, {
      metadata: {
        name,
      },
    });

    deployment.addContainer({
      name,
      image: name,
      imagePullPolicy: ImagePullPolicy.IF_NOT_PRESENT,
      env,
      liveness: Probe.fromHttpGet('/health', { port: 3000 })
    });

    const service = new Service(this, `${name}.service`, {
      metadata: {
        name,
      },
    });

    service.addDeployment(deployment, 80, {
      targetPort: port
    });

    localIngress(this, service);
  }
}
