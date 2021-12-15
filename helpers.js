const distance = (p1, p2) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}

const goalArmDistance = ({ segments, armScale, root, goal }) => (angles) => {
  const joints = getArmJoints({ segments, angles, armScale, root })
  return distance(joints[joints.length - 1], goal)
}

const getArmJoints = ({ segments, angles, armScale, root }) => {
  let position = _.clone(root)
  let joints = [position]
  for (let i = 0; i < segments.length; i++) {
    position = {
      x: position.x + segments[i] * Math.cos(angles[i]) * armScale,
      y: position.y + segments[i] * Math.sin(angles[i]) * armScale
    }
    joints.push(position)
  }
  return joints
}

const getLossGrid = ({ segments, armScale, goal, root, plotCanvasSize }) => {
  const calculateLoss = goalArmDistance({ segments, armScale, goal, root })
  let maxLoss = 0
  const grid = _.times(
    plotCanvasSize,
    (y) => _.times(
      plotCanvasSize,
      (x) => {
        // if ((x + y + 1) % 2 === 0) return 0.5
        const angles = pointToAngles({ point: { x, y }, width: plotCanvasSize, height: plotCanvasSize })
        const loss = calculateLoss(angles)
        maxLoss = Math.max(maxLoss, loss)
        return loss
      }
    )
  )
  for (let y = 0; y < plotCanvasSize; y++) {
    for (let x = 0; x < plotCanvasSize; x++) {
      grid[y][x] /= maxLoss
    }
  }
  return grid
}

const anglesToPoint = ({ angles, width, height }) => {
  return {
    x: interpolateValue(angles[0], -Math.PI, Math.PI, 0, width),
    y: interpolateValue(angles[1], -Math.PI, Math.PI, 0, height)
  }
}

const pointToAngles = ({ point, width, height }) => {
  return [
    interpolateValue(point.x, 0, width - 1, -Math.PI, Math.PI),
    interpolateValue(point.y, 0, height - 1, -Math.PI, Math.PI)
  ]
}


const interpolateValue = (value, minA, maxA, minB, maxB) => {
  const clamped = _.clamp(value, minA, maxA)
  return ((clamped - minA) / (maxA - minA)) * (maxB - minB) + minB
}

const createInterpolatedColors = () => {
  const getColor = (x) => d3.color(d3.interpolateRgbBasis(["blue", "green", "yellow", "red"])(x))
  const interpolatedColors = {}
  for (let i = 0; i < 101; i++) {
    interpolatedColors[i] = getColor(i / 100)
  }
  return interpolatedColors
}

const clearCanvas = (id) => {
  const { ctx, width, height } = getCtx(id)
  ctx.clearRect(0, 0, width, height)
}

const getCtx = (id) => {
  const canvas = document.getElementById(id)
  const ctx = canvas.getContext("2d")
  const width = canvas.width
  const height = canvas.height
  return { ctx, width, height }
}