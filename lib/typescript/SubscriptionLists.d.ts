import { SubscriptionScope } from "./UrbanAirship";
export interface SubscriptionLists {
    channel?: string[];
    contact?: Map<string, SubscriptionScope[]>;
}
export declare type SubscriptionListType = "channel" | "contact";
