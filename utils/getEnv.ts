export type ENV_VARIABLE = 'BACKEND_URL' | 'SOCKET_URL' | 'TURN_URL' | 'TURN_USERNAME' | 'TURN_CREDENTIAL';

export const isDev = () => process.env.NODE_ENV === 'development';
export const isProd = () => process.env.NODE_ENV === 'production';
export const isTest = () => process.env.NODE_ENV === 'test';

export default function getEnv(key: ENV_VARIABLE) {
  if (isDev()) return process.env[`NEXT_PUBLIC_DEV_${key}`];
  if (isProd()) return process.env[`NEXT_PUBLIC_PROD_${key}`];
  if (isTest()) return process.env[`NEXT_PUBLIC_TEST_${key}`];
}
