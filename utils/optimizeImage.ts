import { getBackEndUrl } from './getEnv';

const optimizeImage = (src: string) => {
  // https 로 시작하면 그대로 리턴, 아니면 https 붙여서 리턴
  if (src.startsWith('https')) {
    return src;
  }

  return `${getBackEndUrl()?.replace('/api', '')}/${src}`;
};

export default optimizeImage;
