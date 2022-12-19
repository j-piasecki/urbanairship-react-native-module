import { SubscriptionScope } from "./UrbanAirship";
export interface SubscriptionLists {
    channel?: string[];
    contact?: Map<string, SubscriptionScope[]>;
}
export type SubscriptionListType = "channel" | "contact";
