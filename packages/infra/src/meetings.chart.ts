import { Construct } from "constructs";
import { Chart, ChartProps } from "cdk8s";
import { KubeCronJobV1Beta1 } from "../imports/k8s";
import {
  EnvValue,
  ImagePullPolicy,
  RestartPolicy,
  Service,
  StatefulSet
} from "cdk8s-plus-17";
import { NestService } from "./NestService";

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

    new NestService(this, id, {
      name: "meetings",
      env: {
        DATABASE_URL: EnvValue.fromValue(`postgres://postgres:hunter2@meetings-db:${dbPort}`)
      },
    })

    // // cdk8s-plus-17 does not currently support initContainers but
    // // we can manually patch it up. See
    // // * https://cdk8s.io/docs/latest/concepts/escape-hatches.html
    // // * https://github.com/cdk8s-team/cdk8s/issues/545
    // ApiObject.of(meetingsDeployment).addJsonPatch(
    //   JsonPatch.add("/spec/template/spec/initContainers", [
    //     {
    //       name: "await-psql",
    //       image: "jwilder/dockerize",
    //       imagePullPolicy: ImagePullPolicy.IF_NOT_PRESENT,
    //       command: ["dockerize", "-wait", `tcp://meetings-db:${dbPort}`, "-timeout", "30s"]
    //     },
    //     {
    //       name: "init-meetings-db",
    //       image: "meetings",
    //       imagePullPolicy: ImagePullPolicy.IF_NOT_PRESENT,
    //       // As with the rest of this repo, we're only targeting dev workflows here.
    //       // In prod, we'd likely want to run expand / contract migrations out-of-band
    //       // from the deploy process.
    //       command: ["npx", "prisma", "migrate", "dev"],
    //       env: [
    //         { name: 'DATABASE_URL', value: `postgres://postgres:hunter2@meetings-db:${dbPort}` }
    //       ]
    //     }
    //   ])
    // )

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
