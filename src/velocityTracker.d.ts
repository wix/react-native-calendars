export declare class VelocityTracker {
    history: number[];
    lastPosition?: number;
    lastTimestamp?: number;
    constructor();
    add(position: number): void;
    estimateSpeed(): number;
    reset(): void;
}
