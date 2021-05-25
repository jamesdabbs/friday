import { ConfigService } from '@nestjs/config'

export function fetchEnv(config: ConfigService, key: string) {
  const value = config.get(key)
  if (!value) { throw new Error(`ENV[${key}] is required`)}
  return value
}

export function pick<T, K extends keyof T>(object: T, keys: K[]): Pick<T, K> {
  return Object.assign(
    {},
    ...keys.map(key => {
      if (object && Object.prototype.hasOwnProperty.call(object, key)) {
        return { [key]: object[key] };
      }
    })
  );
};
