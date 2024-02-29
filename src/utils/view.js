export const flyTo = (x, y, z = 500) => {
  viewer.camera.flyTo({
    destination: new Cesium.Cartesian3.fromDegrees(x, y, z),
    orientation: {heading: 6.283185307179586, pitch: -1.5700810794210387, roll: 0},
    duration: 1
  });
}

export function flyToView(x, y, z, heading, pitch, roll) {
  viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(x, y, z),
    orientation: {
      heading,
      pitch,
      roll
    }, duration: 1
  });
}

// 笛卡尔世界坐标转经纬度
export function transformGeometricPosition(x, y, z) {
  const ellipsoid = viewer.scene.globe.ellipsoid;
  const cartesian3 = new Cesium.Cartesian3(x, y, z);
  const cartographic = ellipsoid.cartesianToCartographic(cartesian3);
  const lat = Cesium.Math.toDegrees(cartographic.latitude);
  const lng = Cesium.Math.toDegrees(cartographic.longitude);
  const alt = cartographic.height;
  return {lng, lat, alt}
}
