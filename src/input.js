export class VelocityTracker {
  constructor() {
    this.history = [];
    this.lastPosition = undefined;
    this.lastTimestamp = undefined;
  }

  add(position) {
    const timestamp = new Date().valueOf();
    if (this.lastPosition && timestamp > this.lastTimestamp) {
      const diff = position - this.lastPosition;
      if (diff > 0.001 || diff < -0.001) {
        this.history.push(diff / (timestamp - this.lastTimestamp));
      }
    }
    this.lastPosition = position;
    this.lastTimestamp = timestamp;
  }

  estimateSpeed() {
    const finalTrend = this.history.slice(-3);
    const sum = finalTrend.reduce((r, v) => r + v, 0);
    return sum / finalTrend.length;
  }

  reset() {
    this.history = [];
    this.lastPosition = undefined;
    this.lastTimestamp = undefined;
  }
}
