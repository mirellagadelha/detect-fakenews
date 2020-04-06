import Api from './Api';

export const ApiDetect = {
  detectNews: news => Api.post('response', { news }),
};