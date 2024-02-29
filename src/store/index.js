import {defineStore} from "pinia";

export const useStore = defineStore('main', {
  state: () => {
    return {
      templateId: "",
      sideBarStatusText: "收起",
      tabDataTitle: "",
      tabDataList: [],
      tabDataPanelVisible: false,
      rangeQueryPanelVisible: false,
      currentDynamicComponent: null,
      dynamicComponentProps: null,
      viewPanelVisible: false,
      selectedTabs: [],
      hasEntitiesArrayTabs: [],
      bubbleVisible: false,
      iframeUrl: ""
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
    },
    setTemplateId(id) {
      this.templateId = id
    },
    setCurrentDynamicComponent(component) {
      this.currentDynamicComponent = component
    },
    setViewPanelVisible(visible) {
      this.viewPanelVisible = visible
    },
    setDynamicComponentProps(data) {
      this.dynamicComponentProps = data
    },
    setSelectedTabs(value) {
      this.selectedTabs = value
    },
    setBubbleVisible(visible) {
      this.bubbleVisible = visible
    },
    setIframeUrl(url) {
      this.iframeUrl = url
    },
    setHasEntitiesArrayTabs(value) {
      this.hasEntitiesArrayTabs = value
    },
    setRangeQueryPanelVisible(visible) {
      this.rangeQueryPanelVisible = visible
    }
  }
})
