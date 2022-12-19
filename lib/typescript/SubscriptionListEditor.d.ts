/**
 * Enum of internal subscription list update type.
 * @hidden
 */
declare enum SubscriptionListUpdateType {
    subscribe = "subscribe",
    unsubscribe = "unsubscribe"
}
/**
 * Subscription list operation.
 * @hidden
 */
export interface SubscriptionListUpdate {
    /**
     * The subscription list identifier.
     */
    listId: string;
    /**
     * The subscription list update type.
     */
    type: SubscriptionListUpdateType;
}
/**
 * Subscription list editor.
 */
export declare class SubscriptionListEditor {
    onApply: (subscriptionListUpdates: SubscriptionListUpdate[]) => void;
    subscriptionListUpdates: SubscriptionListUpdate[];
    /**
     */
    constructor(onApply: (subscriptionListUpdates: SubscriptionListUpdate[]) => void);
    /**
     * Subscribes to a list.
     *
     * @param subscriptionListId The subscription list identifier.
     */
    subscribe(subscriptionListId: string): this;
    /**
    * Unsubscribe from a list.
    *
    * @param subscriptionListId The subscription list identifier.
    */
    unsubscribe(subscriptionListId: string): this;
    /**
    * Applies subscription list changes.
    *
    */
    apply(): void;
}
export {};
