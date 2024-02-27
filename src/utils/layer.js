export const findLayer = (name) => {
  return viewer.scene.layers.find(name)
}

export const findMapLayer = (name) => {
  return viewer.imageryLayers._layers.find(layer => {
    return layer._imageryProvider.name === name
  })
}
