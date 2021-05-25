import { Construct } from "constructs";
import { Chart, ChartProps } from "cdk8s";
import { KubeCronJobV1Beta1 } from "../imports/k8s";
import {
  Deployment,
  EnvValue,
  ImagePullPolicy,
  Probe,
  RestartPolicy,
  Service,
  StatefulSet
} from "cdk8s-plus-17";
import { localIngress } from "./util";

export type Props = ChartProps & Partial<{
  schedule: string
}>

export class MeetingsChart extends Chart {
  constructor(scope: Construct, id: string, props: Props = {}) {
    const { schedule = "0 9 * * *", ...rest } = props
    const dbPort = 5432

    super(scope, id, rest);

    const dbService = new Service(this, "meetings.db.svc", {
      metadata: {
        name: "meetings-db"
      }
    })
    dbService.serve(dbPort)

    const dbSts = new StatefulSet(this, "meetings.db.sts", {
      metadata: {
        name: "meetings-db"
      },
      service: dbService
    })

    dbSts.addContainer({
      name: "postgres",
      image: "postgres",
      imagePullPolicy: ImagePullPolicy.IF_NOT_PRESENT,
      port: dbPort,
      env: {
        POSTGRES_PASSWORD: EnvValue.fromValue("hunter2")
      }
    })

    const meetingsDeployment = new Deployment(this, "meetings.deployment", {
      metadata: {
        name: "meetings",
      },
    });

    meetingsDeployment.addContainer({
      name: "meetings",
      image: "meetings",
      imagePullPolicy: ImagePullPolicy.IF_NOT_PRESENT,
      env: {
        DATABASE_URL: EnvValue.fromValue(`postgres://postgres:hunter2@meetings-db:${dbPort}`)
      },
      liveness: Probe.fromHttpGet('/')
    });

    const meetingsServiceName = "meetings";
    const meetingsPort = 3000;

    const meetings = new Service(this, "meetings.service", {
      metadata: {
        name: meetingsServiceName,
      },
    });

    meetings.addDeployment(meetingsDeployment, 80, {
      targetPort: meetingsPort
    });

    localIngress(this, meetings)

    new KubeCronJobV1Beta1(this, "meetings.daily", {
      metadata: {
        name: "meetings-daily-reminder",
      },
      spec: {
        schedule,
        jobTemplate: {
          spec: {
            ttlSecondsAfterFinished: 60,
            template: {
              spec: {
                containers: [
                  {
                    name: "daily-reminder",
                    image: "curlimages/curl",
                    imagePullPolicy: ImagePullPolicy.IF_NOT_PRESENT,
                    command: [
                      "curl",
                      "-XPOST",
                      "meetings/sendDailyReminders",
                    ],
                  },
                ],
                restartPolicy: RestartPolicy.NEVER,
              },
            },
          },
        },
      },
    });
  }
}
