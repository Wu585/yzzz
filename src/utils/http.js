import axios from "axios";

export class Http {
  constructor(baseURL) {
    this.instance = axios.create({
      baseURL,
      timeout: 100000
    });
  }

  // get
  get(url, query, config) {
    return this.instance.request({...config, url: url, params: query, method: 'get'});
  }

// create
  post(url, data, config) {
    return this.instance.request({...config, url, data, method: 'post'});
  }

// update
  patch(url, data, config) {
    return this.instance.request({...config, url, data, method: 'patch'});
  }

// destroy
  delete(url, query, config) {
    return this.instance.request({...config, url: url, params: query, method: 'delete'});
  }
}

export const http = new Http('/api');

http.instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

http.instance.interceptors.response.use((response) => {
  return response.data;
}, error => {
  // 通用错误这里处理，业务错误外面的catch里处理
  if (error.response) {
    const axiosError = error
    if (axiosError.response?.status === 429) {
      alert('你太频繁了');
    } else if (axiosError.response?.status === 500) {
      alert('服务器繁忙');
    }
  }
  // 如果不抛出错误，那么外面调用时catch不到错误，就不会走到catch里面
  return Promise.reject(error);
});
