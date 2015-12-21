import { SpringConfig } from 'rebound';

export default {
  default: SpringConfig.DEFAULT_ORIGAMI_SPRING_CONFIG,
  noWobble: Object.assign({}, SpringConfig.DEFAULT_ORIGAMI_SPRING_CONFIG, { overshootClamping: true })
}