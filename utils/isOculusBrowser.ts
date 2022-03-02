const isOculusBrowser = (userAgent: string) => /(OculusBrowser)/i.test(userAgent);

export default isOculusBrowser;
