/**
 * @hidden
 */
export type DispatchEventsCallback = (source: (eventType: string) => Promise<any>) => Promise<any>;
/**
 * @hidden
 */
export declare abstract class AirshipEventBridge {
    dispatchEventsCallback: DispatchEventsCallback;
    constructor(dispatchEventsCallback: DispatchEventsCallback);
    abstract notifyAirshipListenerAdded(eventListener: string): void;
}
/**
 * SDK event emitter.
 *
 * @hidden
 */
export declare class UAEventEmitter {
    airshipEventBridge: AirshipEventBridge;
    listeners: Map<string, Array<(...args: any[]) => any>>;
    constructor(airshipEventBridgeFactory?: (callback: DispatchEventsCallback) => AirshipEventBridge);
    removeListener(eventType: string, listener: (...args: any[]) => any): void;
    addListener(eventType: string, listener: (...args: any[]) => any): void;
    removeAllListeners(eventType: string): void;
    private dispatchEvents;
}
