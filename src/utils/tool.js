import {useRoute} from "vue-router";
import {http} from "./http.js";

let pickInfo;//坐标拾取
export default class PickInfo {

  constructor(obj) {
    let {viewer, tooltip, type} = obj;
    this.viewer = viewer;
    this.initPrimitives();
    this.newOnePrimitives = false;
    if (!type) {
      this.newOnePrimitives = true;
    } else if (type === 'dl') {
      this.newOnePrimitives = false;
    } else if (type === 'gc') {
      this.newOnePrimitives = true;
    }
  }

  static get instance() {
    if (!PickInfo._instance) {
      Object.defineProperty(PickInfo, '_instance', {
        value: new PickInfo()
      });
    }
    return PickInfo._instance;
  }

  // 初始化
  initPrimitives() {
    const points = new Cesium.PointPrimitiveCollection();
    const labels = new Cesium.LabelCollection();
    const collection = new Cesium.PrimitiveCollection();
    collection.add(points);
    collection.add(labels)
    this.viewer.scene.primitives.add(collection);
    this.points = points;
    this.labels = labels;
    this.collection = collection;
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
  }

  //激活
  activate() {
    this.deactivate();
    this.registerEvents();
    this.isPick = true;
  }

  //禁用
  deactivate() {
    if (!this.isPick) return;
    this.unClickEvent();
    this.isPick = false;
  }

  clearObj() {
    this.points.removeAll();
    this.labels.removeAll();
  }

  //清空绘制
  clear() {
    if (this.collection.length > 0) {
      this.viewer.scene.primitives.remove(this.collection);
    }
  }

  createCollection(cartesian, longitude, latitude, height) {
    this.createPoints(cartesian);
    this.createLabel(cartesian, longitude, latitude, height);
  }

  createPoints(cartesian) {
    this.points.add({
      position: cartesian,
      pixelSize: 18,
      color: Cesium.Color.YELLOW,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    });
  }

  createLabel(cartesian, longitude, latitude, height) {
    let lng = longitude.toFixed(6);
    let lat = latitude.toFixed(6);
    let h = height.toFixed(2);
    let text = `经度: ${lng}\u00B0\n纬度: ${lat}\u00B0\n高程: ${h}m`
    this.labels.add({
      position: cartesian,
      text: text,
      showBackground: true,
      font: '14pt monospace',
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      disableDepthTestDistance: Number.POSITIVE_INFINITY
    });
  }

  leftClickEvent() {
    //单击鼠标左键画点点击事件
    this.handler.setInputAction(e => {
      let position = this.viewer.scene.pickPosition(e.position);
      if (!position) {
        const ellipsoid = this.viewer.scene.globe.ellipsoid;
        position = this.viewer.scene.camera.pickEllipsoid(e.position, ellipsoid);
      }
      if (!position) return;
      let cartographic = Cesium.Cartographic.fromCartesian(position);
      let longitude = Cesium.Math.toDegrees(cartographic.longitude);
      let latitude = Cesium.Math.toDegrees(cartographic.latitude);
      let height = cartographic.height;
      if (height < 0) {
        height = 0;
      }
      if (this.newOnePrimitives) {
        this.clearObj();
      }
      this.createCollection(position, longitude, latitude, height);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  rightClickEvent() {
    this.handler.setInputAction(e => {
      this.unClickEvent();
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  registerEvents() {
    this.leftClickEvent();
    this.rightClickEvent();
  }

  //解除鼠标事件
  unClickEvent() {
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }
}

export function zbsq() {
  clear()

  // coordinatePicking()
  if (pickInfo) {
    pickInfo.clear()
  }
  pickInfo = new PickInfo({viewer})
  pickInfo.activate()
}

export function clearPick() {
  pickInfo?.deactivate()

  pickInfo?.clear()
}


// 点位查询
let scenePosition = null;

function setBubblePosition() {
  if (scenePosition.value) {
    const windowPosition = new Cesium.Cartesian2();
    Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, scenePosition.value, windowPosition);
    document.getElementById("bubble-container").style.top = windowPosition.y + "px";
    document.getElementById("bubble-container").style.left = windowPosition.x + "px";
  }
}


export const queryEntity = () => {
  viewer.scene.postRender.addEventListener(setBubblePosition);

  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)

  handler.setInputAction((movement) => {
    let position = viewer.scene.pickPosition(movement.position);
    const pick = viewer.scene.pick(movement.position);

    if (!pick) {
      store.setCurrentDynamicComponent(null)
    }

    if (!position) {
      scenePosition = Cesium.Cartesian3.fromDegrees(0, 0, 0);
    }

    console.log('pick');
    console.log(pick);

    if (pick && pick.id) {
      const description = JSON.parse(pick.id._description)
      scenePosition = Cesium.Cartesian3.fromDegrees(description.longitude, description.latitude)

      if (description.entityType === "monitor") {
        // store.setCurrentDynamicComponent(MonitorPanel)
      }
    }

  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}

let handlerDis, handlerHeight, handlerArea, handlerPoint, handlerLine, handlerPolygon, handlerCurrency, handlerLineAdd;
let handler, handlerKsy;
let clampMode = 0; // 空间模式
let tooltip = window.createTooltip(document.body);
let tooltip2 = window.createTooltip(document.body);
let polygonEntity

//距离测量
export function calcDistance(lineColor, fillColor) {
  clear()
  if (handlerDis) {
    handlerDis && handlerDis.clear();
  }

  const {scene} = viewer;
  handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
  handlerDis = new Cesium.MeasureHandler(
    viewer,
    Cesium.MeasureMode.Distance,
    clampMode
  );
  handlerDis.measureEvt.addEventListener(function (result) {
    // handlerDis.disLabel._fillColor = {red:1,green:1,blue:1,alpha:1}
    const dis = Number(result.distance);
    // const positions = result.positions;
    const distance =
      dis > 1000 ? (dis / 1000).toFixed(2) + "km" : dis.toFixed(2) + "m";
    handlerDis.disLabel.text = "距离:" + distance;
  });
  handler.setInputAction(function (event) {
    tooltip.showAt(event.endPosition, '<p style="height: 40px;line-height: 40px;font-size: 20px;text-align: left;">左键确定距离点,右键结束绘制,进行距离测量.</p>');
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  handler.setInputAction(function (event) {
    handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    tooltip.setVisible(false);
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  handlerDis && handlerDis.activate();
}

// 面积测量
export function calcArea() {
  if (handlerArea) {
    handlerArea && handlerArea.clear();
  }

  //初始化测量面积
  const {scene} = viewer;
  handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
  handlerArea = new Cesium.MeasureHandler(viewer, Cesium.MeasureMode.Area, clampMode);
  handlerArea.measureEvt.addEventListener(function (result) {
    // debugger
    var mj = Number(result.area);
    var area = mj > 1000000 ? (mj / 1000000).toFixed(2) + 'km²' : mj.toFixed(2) + '㎡'
    handlerArea.areaLabel.text = '面积:' + area;
  });
  handler.setInputAction(function () {
    handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    handlerArea.polyline._show = false
    tooltip2.setVisible(false);
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  handler.setInputAction(function (event) {
    tooltip2.showAt(event.endPosition, '<p style="height: 40px;line-height: 40px;font-size: 20px;text-align: left;">鼠标左键确定面大小，右键结束绘制,进行面积测量.</p>');
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  handlerArea && handlerArea.activate()
}

export function clear() {
  if (pickInfo) {
    pickInfo.clear()
  }
  handlerDis && handlerDis.deactivate();
  handlerDis && handlerDis.clear();
  handlerHeight && handlerHeight.deactivate();
  handlerHeight && handlerHeight.clear();
  handlerArea && handlerArea.deactivate();
  handlerArea && handlerArea.clear();
  handlerPolygon && handlerPolygon.clear();
  viewer.entities.remove(polygonEntity)
}

export const reset = async () => {
  clear()
}


export const boxSelectQuery = (lineColor, fillColor) => {
  clear()

  viewer.entities.remove(polygonEntity)

  if (handlerPolygon) {
    handlerPolygon && handlerPolygon.clear();
  }

  handlerPolygon = new Cesium.DrawHandler(
    viewer,
    Cesium.DrawMode.Polygon,
  );

  // 监听绘制完成事件
  handlerPolygon.drawEvt.addEventListener(function (result) {
    // 创建多边形实体
    polygonEntity = viewer.entities.add({
      polygon: {
        hierarchy: result.object.positions,
        material: Cesium.Color.fromCssColorString(fillColor), // 设置多边形的颜色,
        outline: true, // 显示边框
        outlineColor: Cesium.Color.fromCssColorString(lineColor), // 设置边框颜色,
        outlineWidth: 10.0 // 多边形的边框宽度
      }
    });

    console.log('polygonEntity');
    console.log(polygonEntity);

    // 停用绘制处理器
    handlerPolygon.deactivate();
  });



  handlerPolygon && handlerPolygon.activate();
}

