import { EnvValue, IngressV1Beta1, IngressV1Beta1Backend, Service } from "cdk8s-plus-17"
import { Construct } from "constructs"

export function envPassthrough(secret: string, keys: string[]) {
  const env: Record<string, EnvValue> = {}

  for (const key of keys) {
    env[key] = EnvValue.fromSecretValue({
      secret: { name: secret },
      key
    })
  }

  return env
}

export function localIngress(construct: Construct, service: Service) {
  const name = service.metadata.name
  if (!name) {
    throw Error(`Cannot define local ingress without a service name`)
  }

  const ingress = new IngressV1Beta1(construct, `${name}.ingress.local`)

  ingress.addHostDefaultBackend(
    `${name}.localhost`,
    IngressV1Beta1Backend.fromService(service)
  )
}
