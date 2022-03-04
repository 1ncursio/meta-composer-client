export type ENV_VARIABLE = 'BACKEND_URL' | 'SOCKET_URL' | 'TURN_URL' | 'TURN_USERNAME' | 'TURN_CREDENTIAL';

export const isDev = () => process.env.NODE_ENV === 'development';
export const isProd = () => process.env.NODE_ENV === 'production';
export const isTest = () => process.env.NODE_ENV === 'test';

export function getBackEndUrl() {
  if (isDev()) return process.env.NEXT_PUBLIC_DEV_BACKEND_URL;
  if (isProd()) return process.env.NEXT_PUBLIC_PROD_BACKEND_URL;
  if (isTest()) return process.env.NEXT_PUBLIC_TEST_BACKEND_URL;
}

export function getSocketUrl() {
  if (isDev()) return process.env.NEXT_PUBLIC_DEV_SOCKET_URL;
  if (isProd()) return process.env.NEXT_PUBLIC_PROD_SOCKET_URL;
  if (isTest()) return process.env.NEXT_PUBLIC_TEST_SOCKET_URL;
}

export function getTurnUrl() {
  if (isDev()) return process.env.NEXT_PUBLIC_DEV_TURN_URL;
  if (isProd()) return process.env.NEXT_PUBLIC_PROD_TURN_URL;
  if (isTest()) return process.env.NEXT_PUBLIC_TEST_TURN_URL;
}

export function getTurnUsername() {
  if (isDev()) return process.env.NEXT_PUBLIC_DEV_TURN_USERNAME;
  if (isProd()) return process.env.NEXT_PUBLIC_PROD_TURN_USERNAME;
  if (isTest()) return process.env.NEXT_PUBLIC_TEST_TURN_USERNAME;
}

export function getTurnCredential() {
  if (isDev()) return process.env.NEXT_PUBLIC_DEV_TURN_CREDENTIAL;
  if (isProd()) return process.env.NEXT_PUBLIC_PROD_TURN_CREDENTIAL;
  if (isTest()) return process.env.NEXT_PUBLIC_TEST_TURN_CREDENTIAL;
}
