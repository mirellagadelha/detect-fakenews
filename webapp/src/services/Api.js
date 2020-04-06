import axios from "axios";

const Api = axios.create({
  baseURL: 'https://fakenews-detect-tcc.appspot.com/',
});

export default Api;