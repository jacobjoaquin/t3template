export function canvasToImgNode(canvas) {
  const imgNode = new Image()
  imgNode.src = canvas.toDataURL()
  return imgNode
}

export const TAU = Math.PI * 2