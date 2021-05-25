import { Construct } from "constructs";
import { ApiObjectMetadataDefinition, Chart, ChartProps } from "cdk8s";
import { KubeNamespace } from "../imports/k8s";
import {
  Kafka,
  KafkaProps,
  KafkaSpecKafkaListenersType,
  KafkaSpecKafkaStorageType,
  KafkaSpecKafkaStorageVolumesType,
  KafkaSpecZookeeperStorageType,
} from "../imports/kafka.strimzi.io";

type WithMeta<T> = T & {
  metadata?: Partial<ApiObjectMetadataDefinition>;
};

export class KafkaChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = {}) {
    super(scope, id, props);

    const kafkaNamespace = new KubeNamespace(this, "kafka-namespace", {
      metadata: {
        name: "kafka",
      },
    });

    const kafkaProps: WithMeta<KafkaProps> = {
      metadata: {
        namespace: kafkaNamespace.metadata.name,
        name: "kafka-cluster",
      },
      spec: {
        kafka: {
          version: "2.8.0",
          replicas: 1,
          listeners: [
            {
              name: "plain",
              port: 9092,
              type: KafkaSpecKafkaListenersType.INTERNAL,
              tls: false,
            },
            {
              name: "tls",
              port: 9093,
              type: KafkaSpecKafkaListenersType.INTERNAL,
              tls: true,
            },
          ],
          config: {
            "offsets.topic.replication.factor": 1,
            "transaction.state.log.replication.factor": 1,
            "transaction.state.log.min.isr": 1,
            "log.message.format.version": "2.8",
            "inter.broker.protocol.version": "2.8",
          },
          storage: {
            type: KafkaSpecKafkaStorageType.JBOD,
            volumes: [
              {
                id: 0,
                type: KafkaSpecKafkaStorageVolumesType.PERSISTENT_CLAIM,
                size: "1Gi",
                deleteClaim: false,
              },
            ],
          },
        },
        zookeeper: {
          replicas: 1,
          storage: {
            type: KafkaSpecZookeeperStorageType.PERSISTENT_CLAIM,
            size: "1Gi",
            deleteClaim: false,
          },
        },
      },
    };

    new Kafka(this, "kafka-cluster", kafkaProps);
  }
}
