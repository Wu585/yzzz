import {http, Http} from "./http.js";

export const dataHttp = new Http("/data-api")

// 监控
export const getVideoList = () => {
  return dataHttp.post("video-router/findOrgTreeByCodeAndDevices")
}

// 监控核查
export const getMonitorCheckList = () => {
  return dataHttp.get("monitor-check/queryAll")
}

// 工单
export const getWorkOrderList = () => {
  return dataHttp.get(`wo-order/queryAll`)
}

// 公共厕所
export const getWC = () => {
  return dataHttp.get("ggcs/queryAll")
}

// 物资库
export const getWzK = () => {
  return dataHttp.get("app-db-material-address/queryAll")
}

export const getViewList = () => {
  return http.get("cameraPerspective/queryAll")
}

export const addView = (data) => {
  return http.post("cameraPerspective/create", data)
}

export const patchView = (data) => {
  return http.post("cameraPerspective/update", data)
}

export const deleteV = (id) => {
  return http.post(`cameraPerspective/delete?id=${id}`)
}
