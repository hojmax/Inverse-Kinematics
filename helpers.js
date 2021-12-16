const distance = (p1, p2) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}

const goalArmDistance = ({ arm, goal }) => (angles) => {
  const joints = getArmJoints({ arm: { ...arm, angles: angles } })
  return distance(joints[joints.length - 1], goal)
}

const getGradient = ({ arm, goal }) => {
  const l0 = arm.segments[0]
  const l1 = arm.segments[1]
  const v0 = arm.angles[0]
  const v1 = arm.angles[1]
  const gx = goal.x
  const gy = goal.y
  const armX = arm.joints[arm.joints.length - 1].x
  const armY = arm.joints[arm.joints.length - 1].y
  const deltaX = gx - armX
  const deltaY = gy - armY
  return [
    (deltaX * Math.sin(v0) - deltaY * Math.cos(v0)) * l0,
    (deltaX * Math.sin(v1) - deltaY * Math.cos(v1)) * l1
  ]
}

const getArmJoints = ({ arm }) => {
  let position = { x: 0, y: 0 }
  let joints = [position]
  for (let i = 0; i < arm.segments.length; i++) {
    position = {
      x: position.x + arm.segments[i] * Math.cos(arm.angles[i]),
      y: position.y + arm.segments[i] * Math.sin(arm.angles[i])
    }
    joints.push(position)
  }
  return joints
}

const getLossGrid = ({ arm, plot, goal }) => {
  const calculateLoss = goalArmDistance({ arm, goal })
  let maxLoss = 0
  const grid = _.times(
    plot.canvasSize,
    (y) => _.times(
      plot.canvasSize,
      (x) => {
        const angles = pointToAngles({ point: { x, y }, width: plot.canvasSize, height: plot.canvasSize })
        const loss = calculateLoss(angles)
        maxLoss = Math.max(maxLoss, loss)
        return loss
      }
    )
  )
  for (let y = 0; y < plot.canvasSize; y++) {
    for (let x = 0; x < plot.canvasSize; x++) {
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
  for (let i = 0; i < state.colorAmount + 1; i++) {
    interpolatedColors[i] = getColor(i / state.colorAmount)
  }
  return interpolatedColors
}

const boundAngle = (angle) => {
  if (angle < -Math.PI) return angle + 2 * Math.PI
  if (angle > Math.PI) return angle - 2 * Math.PI
  return angle
}

const getCtx = (id) => {
  const canvas = document.getElementById(id)
  const ctx = canvas.getContext("2d")
  return ctx
}