import {defineStore} from "pinia";

export const useStore = defineStore('main', {
  state: () => {
    return {
      sideBarStatusText: "收起",
      tabDataTitle: "",
      tabDataList: [],
      tabDataPanelVisible: false
    }
  },
  actions: {
    setTabDataTitle(title) {
      this.tabDataTitle = title
    },
    setTabDataList(data) {
      this.tabDataList = data
    },
    setTabDataPanelVisible(visible) {
      this.tabDataPanelVisible = visible
    },
    setSideBarStatusText(value) {
      this.sideBarStatusText = value
    }
  }
})
