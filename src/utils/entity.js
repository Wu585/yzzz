export const addEntity = (lon, lat, hei, imageUrl, description="") => {
  return viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(lon, lat, hei),
    billboard: {
      image: "/assets/entity-icons/monitor.png",
      width: 32,
      height: 64,
    },
    description: JSON.stringify(description)
  })
}

export const addMonitorEntity = (id, lon, lat, hei, description = "") => {
  return viewer.entities.add({
    id,
    position: Cesium.Cartesian3.fromDegrees(lon, lat, hei),
    billboard: {
      image: "/assets/entity-icons/monitor.png",
      width: 32,
      height: 64,
    },
    description: JSON.stringify(description)
  })
}

export const addMonitorCheckEntity = (id, lon, lat, hei, description = "") => {
  return viewer.entities.add({
    id,
    position: Cesium.Cartesian3.fromDegrees(lon, lat, hei),
    billboard: {
      image: "/assets/entity-icons/monitor-check.png",
      width: 32,
      height: 64,
    },
    description: JSON.stringify(description)
  })
}

export const addWcEntity = (id, lon, lat, hei, description = "") => {
  return viewer.entities.add({
    id,
    position: Cesium.Cartesian3.fromDegrees(lon, lat, hei),
    billboard: {
      image: "/assets/entity-icons/wc.png",
      width: 32,
      height: 64,
    },
    description: JSON.stringify(description)
  })
}

export const addWzkEntity = (id, lon, lat, hei, description = "") => {
  return viewer.entities.add({
    id,
    position: Cesium.Cartesian3.fromDegrees(lon, lat, hei),
    billboard: {
      image: "/assets/entity-icons/wzk.png",
      width: 32,
      height: 64,
    },
    description: JSON.stringify(description)
  })
}
