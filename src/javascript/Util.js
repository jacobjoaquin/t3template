export function canvasToImgNode(canvas) {
  const imgNode = new Image()
  imgNode.src = canvas.toDataURL()
  return imgNode
}
