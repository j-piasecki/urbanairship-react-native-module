import { CustomEvent } from "./CustomEvent";
import { TagGroupEditor } from "./TagGroupEditor";
import { AttributeEditor } from "./AttributeEditor";
import { SubscriptionListEditor } from "./SubscriptionListEditor";
import { ScopedSubscriptionListEditor } from "./ScopedSubscriptionListEditor";
import { JsonObject, JsonValue } from "./Json";
import { SubscriptionLists, SubscriptionListType } from "./SubscriptionLists";
import { PreferenceCenter } from './PreferenceCenter';
/**
 * Enum of event type names.
 */
export declare enum EventType {
    /**
     * Notification response event. On Android, this event will be dispatched
     * in the background for background notifications actions.
     */
    NotificationResponse = "notification_response",
    /**
     * Push received event. On Android, this event will only be dispatched
     * in the background if the app is able to start a service or by sending a
     * high priority FCM message.
     */
    PushReceived = "push_received",
    /**
     * Channel created event.
     */
    ChannelCreated = "channel_created",
    /**
     * Deep link event.
     */
    DeepLink = "deep_link",
    /**
     * Notification opt-in status event.
     */
    NotificationOptInStatus = "notification_opt_in_status",
    /**
     * Message Center updated event.
     */
    MessageCenterUpdated = "message_center_updated",
    /**
     * Display Message Center event.
     */
    DisplayMessageCenter = "display_message_center",
    /**
     * Display preference center event.
     */
    DisplayPreferenceCenter = "display_preference_center",
    /**
     * Push token received.
     */
    PushTokenReceived = "push_token_received"
}
/**
 * Inbox message object.
 */
export interface InboxMessage {
    /**
     * The message ID. Needed to display, mark as read, or delete the message.
     */
    id: string;
    /**
     * The message title.
     */
    title: string;
    /**
     * The message sent date in milliseconds.
     */
    sentDate: number;
    /**
     * Optional - The icon url for the message.
     */
    listIconUrl: string;
    /**
     * The unread / read status of the message.
     */
    isRead: boolean;
    /**
     * The deleted status of the message.
     */
    isDeleted: boolean;
    /**
     * String to String map of any message extras.
     */
    extras: Record<string, string>;
}
/**
 * Event fired when a push is received.
 */
export interface PushReceivedEvent {
    pushPayload: PushPayload;
}
/**
 * The push payload.
 */
export interface PushPayload {
    /**
     * The alert.
     */
    alert?: string;
    /**
     * The title.
     */
    title?: string;
    /**
     * The notification ID.
     */
    notificationId?: string;
    /**
     * The notification extras.
     */
    extras: JsonObject;
}
/**
 * Event fired when the user initiates a notification response.
 */
export interface NotificationResponseEvent {
    /**
     * The push notification.
     */
    pushPayload: PushPayload;
    /**
     * The action button ID, if available.
     */
    actionId?: string;
    /**
     * Indicates whether the response was a foreground action.
     * This value is always if the user taps the main notification,
     * otherwise it is defined by the notification action button.
     */
    isForeground: boolean;
}
/**
 * Airship config environment
 */
export interface ConfigEnvironment {
    /**
     * App key.
     */
    appKey: string;
    /**
     * App secret.
     */
    appSecret: string;
    /**
     * Optional log level.
     */
    logLevel?: LogLevel;
}
/**
 * Possible sites.
 */
export declare type Site = "us" | "eu";
/**
 * Log levels.
 */
export declare type LogLevel = "verbose" | "debug" | "info" | "warning" | "error" | "none";
/**
 * Airship config
 */
export interface AirshipConfig {
    /**
     * Default environment.
     */
    default?: ConfigEnvironment;
    /**
     * Development environment. Overrides default environment if inProduction is false.
     */
    development?: ConfigEnvironment;
    /**
     * Production environment. Overrides default environment if inProduction is true.
     */
    production?: ConfigEnvironment;
    /**
     * Cloud site.
     */
    site?: Site;
    /**
     * Switches the environment from development or production. If the value is not
     * set, Airship will determine the value at runtime.
     */
    inProduction?: boolean;
    /**
     * URL allow list.
     */
    urlAllowList?: string[];
    /**
     * URL allow list for open URL scope.
     */
    urlAllowListScopeOpenUrl?: string[];
    /**
     * URL allow list for JS bridge injection.
     */
    urlAllowListScopeJavaScriptInterface?: string[];
    /**
     * Enables delayed channel creation.
     */
    isChannelCreationDelayEnabled?: boolean;
    /**
     * Initial config URL for custom Airship domains. The URL
     * should also be added to the urlAllowList.
     */
    initialConfigUrl?: String;
    /**
     * Enabled features. Defaults to all.
     */
    enabledFeatures?: Feature[];
    /**
     * iOS config.
     */
    ios?: {
        /**
         * itunesId for rate app and app store deep links.
         */
        itunesId?: string;
    };
    /**
     * Android config.
     */
    android?: {
        /**
         * App store URI
         */
        appStoreUri?: string;
        /**
         * Fcm app name if using multiple FCM projects.
         */
        fcmFirebaseAppName?: string;
        /**
         * Notification config.
         */
        notificationConfig?: NotificationConfigAndroid;
    };
}
/**
 * Subscription Scope types.
 */
export declare enum SubscriptionScope {
    App = "app",
    Web = "web",
    Sms = "sms",
    Email = "email"
}
/**
 * iOS options
 */
export declare namespace iOS {
    /**
     * Enum of notification options. iOS only.
     */
    enum NotificationOption {
        /**
         * Alerts.
         */
        Alert = "alert",
        /**
         * Sounds.
         */
        Sound = "sound",
        /**
         * Badges.
         */
        Badge = "badge",
        /**
         * Car play.
         */
        CarPlay = "car_play",
        /**
         * Critical Alert.
         */
        CriticalAlert = "critical_alert",
        /**
         * Provides app notification settings.
         */
        ProvidesAppNotificationSettings = "provides_app_notification_settings",
        /**
         * Provisional.
         */
        Provisional = "provisional"
    }
    /**
     * Enum of foreground notification options.
     */
    enum ForegroundPresentationOption {
        /**
         * Play the sound associated with the notification.
         */
        Sound = "sound",
        /**
         * Apply the notification's badge value to the app’s icon.
         */
        Badge = "badge",
        /**
         * Show the notification in Notification Center. On iOS 13 an older,
         * this will also show the notification as a banner.
         */
        List = "list",
        /**
        * Present the notification as a banner. On iOS 13 an older,
        * this will also show the notification in the Notification Center.
        */
        Banner = "banner"
    }
    /**
     * Enum of authorized notification settings.
     */
    enum AuthorizedNotificationSetting {
        /**
         * Alerts.
         */
        Alert = "alert",
        /**
         * Sounds.
         */
        Sound = "sound",
        /**
         * Badges.
         */
        Badge = "badge",
        /**
         * CarPlay.
         */
        CarPlay = "car_play",
        /**
         * Lock screen.
         */
        LockScreen = "lock_screen",
        /**
         * Notification center.
         */
        NotificationCenter = "notification_center",
        /**
         * Critical alert.
         */
        CriticalAlert = "critical_alert",
        /**
         * Announcement.
         */
        Announcement = "announcement",
        /**
         * Scheduled delivery.
         */
        ScheduledDelivery = "scheduled_delivery",
        /**
        * Time sensitive.
        */
        TimeSensitive = "time_sensitive"
    }
    /**
     * Enum of authorized status.
     */
    enum AuthorizedNotificationStatus {
        /**
         * Not determined.
         */
        NotDetermined = "not_determined",
        /**
         * Denied.
         */
        Denied = "denied",
        /**
         * Authorized.
         */
        Authorized = "authorized",
        /**
         * Provisional.
         */
        Provisional = "provisional",
        /**
         * Ephemeral.
         */
        Ephemeral = "ephemeral"
    }
}
export interface NotificationStatus {
    /**
     * If airship is opted in for push notifications are not.
     */
    airshipOptIn: boolean;
    /**
     * If notifications are enabled on Airship or not.
     */
    airshipEnabled: boolean;
    /**
     * If notifications are enabled in the app settings or not.
     */
    systemEnabled: boolean;
    /**
     * iOS status.
     */
    ios?: {
        /**
         * Authorized settings.
         */
        authorizedSettings: [iOS.AuthorizedNotificationSetting];
        /**
         * Authorized status.
         */
        authorizedStatus: iOS.AuthorizedNotificationStatus;
    };
}
/**
 * Event fired when the notification opt-in status changes.
 */
export interface NotificationOptInStatusEvent {
    /**
     * Whether the user is opted in to notifications.
     */
    optIn: boolean;
    /**
     * The authorized notification settings. iOS only.
     */
    authorizedSettings?: [iOS.AuthorizedNotificationSetting];
}
/**
 * Event fired when the Message Center  is updated.
 */
export interface MessageCenterUpdatedEvent {
    /**
     * The unread message count.
     */
    messageUnreadCount: number;
    /**
     * The total message count.
     */
    messageCount: number;
}
/**
 * Event fired when the Message Center is requested to be displayed.
 */
export interface DisplayMessageCenterEvent {
    /**
     * The message ID, if available.
     */
    messageId?: string;
}
/**
 * Event fired when a deep link is opened.
 */
export interface DeepLinkEvent {
    /**
     * The deep link string.
     */
    deepLink: string;
}
/**
 * Event fired when a preference center is requested to be displayed.
 */
export interface DisplayPreferenceCenterEvent {
    /**
     * The preference center Id.
     */
    preferenceCenterId: string;
}
/**
 * A listener subscription.
 */
export declare class Subscription {
    onRemove: () => void;
    constructor(onRemove: () => void);
    /**
     * Removes the listener.
     */
    remove(): void;
}
/**
 * Event fired when a channel registration occurs.
 */
export interface ChannelCreatedEvent {
    /**
     * The channel ID.
     */
    channelId: string;
}
export interface PushTokenReceivedEvent {
    /**
    * The push token.
    */
    pushToken: string;
}
/**
 * Android notification config.
 */
export interface NotificationConfigAndroid {
    /**
     * The icon resource name.
     */
    icon?: string;
    /**
     * The large icon resource name.
     */
    largeIcon?: string;
    /**
     * The default android notification channel ID.
     */
    defaultChannelId?: string;
    /**
     * The accent color. Must be a hex value #AARRGGBB.
     */
    accentColor?: string;
}
/**
 * Enum of authorized Features.
 */
export declare enum Feature {
    None = "none",
    InAppAutomation = "in_app_automation",
    MessageCenter = "message_center",
    Push = "push",
    Chat = "chat",
    Analytics = "analytics",
    TagsAndAttributes = "tags_and_attributes",
    Contacts = "contacts",
    Location = "location",
    All = "all"
}
/**
* The main Airship API.
*/
export declare class UrbanAirship {
    /**
     * Calls takeOff. If Airship is already initialized the new config will be applied on next app init.
     *
     * @param config The airship config.
     * @return A promise with the result. The result will be true if Airship is initialized, otherwise false.
     */
    static takeOff(config: AirshipConfig): Promise<boolean>;
    /**
     * Checks if Airship is initialized.
     *
     * @return A promise with the result. The result will be true if Airship is initialized, otherwise false.
     */
    static isFlying(): Promise<boolean>;
    /**
     * Sets the Android notification config. Values not set will fallback to any values set in the airship config options.
     *
     * @param config The notification config object.
     */
    static setAndroidNotificationConfig(config: NotificationConfigAndroid): void;
    /**
     * Sets user notifications enabled. The first time user notifications are enabled
     * on iOS, it will prompt the user for notification permissions.
     *
     * @param enabled true to enable notifications, false to disable.
     */
    static setUserNotificationsEnabled(enabled: boolean): void;
    /**
     * Checks if user notifications are enabled or not.
     *
     * @return A promise with the result.
     */
    static isUserNotificationsEnabled(): Promise<boolean>;
    /**
     * Sets the SDK features that will be enabled. The rest of the features will be disabled.
     *
     * If all features are disabled the SDK will not make any network requests or collect data.
     *
     * @note All features are enabled by default.
     * @param feature An array of `Features` to enable.
     * @return A promise that returns true if the enablement was authorized.
     */
    static setEnabledFeatures(features: Feature[]): Promise<boolean>;
    /**
     * Gets a Feature array with the enabled features.
     *
     * @return A promise that returns the enabled features as a Feature array.
     */
    static getEnabledFeatures(): Promise<Feature[]>;
    /**
     * Enables one or many features.
     *
     * @param feature An array of `Feature` to enable.
     * @return A promise that returns true if the enablement was authorized.
     */
    static enableFeature(features: Feature[]): Promise<boolean>;
    /**
     * Disables one or many features.
     *
     * @param feature An array of `Feature` to disable.
     * @return A promise that returns true if the disablement was authorized.
     */
    static disableFeature(features: Feature[]): Promise<boolean>;
    /**
     * Checks if a given feature is enabled or not.
     *
     * @return A promise that returns true if the features are enabled, false otherwise.
     */
    static isFeatureEnabled(features: Feature[]): Promise<boolean>;
    /**
     * Enables user notifications.
     *
     * @return A promise that returns true if enablement was authorized
     * or false if enablement was rejected
     */
    static enableUserPushNotifications(): Promise<boolean>;
    /**
     * Enables channel creation if `channelCreationDelayEnabled` was
     * enabled in the config.
     */
    static enableChannelCreation(): void;
    /**
     * Gets the count of Unread messages in the inbox.
     */
    static getUnreadMessageCount(): Promise<number>;
    /**
     * Gets the notification status for the app.
     *
     * @return A promise with the result.
     */
    static getNotificationStatus(): Promise<NotificationStatus>;
    /**
     * Gets the status of the specified Notification Channel.
     * This method is only supported on Android. iOS will throw an error.
     *
     * @param channel The channel's name.
     * @return A promise with the result.
     */
    static getNotificationChannelStatus(channel: string): Promise<string>;
    /**
     * Sets the named user.
     *
     * @param namedUser The named user string, or null/undefined to clear the named user.
     */
    static setNamedUser(namedUser: string | null | undefined): void;
    /**
     * Gets the named user.
     *
     * @return A promise with the result.
     */
    static getNamedUser(): Promise<string | null | undefined>;
    /**
     * Adds a channel tag.
     *
     * @param tag A channel tag.
     */
    static addTag(tag: string): void;
    /**
     * Removes a channel tag.
     *
     * @param tag A channel tag.
     */
    static removeTag(tag: string): void;
    /**
     * Gets the channel tags.
     *
     * @return A promise with the result.
     */
    static getTags(): Promise<string[]>;
    /**
     * Gets the subscription lists.
     *
     * @param types The types of subscription lists. Values: `channel`, `contact` (default: [`channel`]).
     * @return A promise with the result.
     */
    static getSubscriptionLists(types?: [...SubscriptionListType[]]): Promise<SubscriptionLists>;
    /**
     * Creates an editor to modify the contact tag groups.
     *
     * @return A tag group editor instance.
     */
    static editContactTagGroups(): TagGroupEditor;
    /**
     * Creates an editor to modify the channel tag groups.
     *
     * @return A tag group editor instance.
     */
    static editChannelTagGroups(): TagGroupEditor;
    /**
     * Creates an editor to modify the channel attributes.
     *
     * @return An attribute editor instance.
     */
    static editChannelAttributes(): AttributeEditor;
    /**
     * Creates an editor to modify the contact attributes.
     *
     * @return An attribute editor instance.
     */
    static editContactAttributes(): AttributeEditor;
    /**
     * Edit the subscription lists associated with the current Channel.
     *
     * @return A promise with the result.
     */
    static editChannelSubscriptionLists(): SubscriptionListEditor;
    /**
     * Edit the subscription lists associated with the current Contact.
     *
     * @return A promise with the result.
     */
    static editContactSubscriptionLists(): ScopedSubscriptionListEditor;
    /**
     * Initiates screen tracking for a specific app screen, must be called once per tracked screen.
     *
     * @param screen The screen's string identifier
     */
    static trackScreen(screen: string): void;
    /**
     * Gets the channel ID.
     *
     * @return A promise with the result.
     */
    static getChannelId(): Promise<string | null | undefined>;
    /**
     * Gets the registration token.
     *
     * @return A promise with the result. The registration token might be undefined
     * if registration is currently in progress, if the app is not setup properly
     * for remote notifications, if running on an iOS simulator, or if running on
     * an Android device that has an outdated or missing version of Google Play Services.
     */
    static getRegistrationToken(): Promise<string | null | undefined>;
    /**
     * Associates an identifier for the Connect data stream.
     *
     * @param key The identifier's key.
     * @param id The identifier's id, or null/undefined to clear.
     */
    static associateIdentifier(key: string, id?: string): void;
    /**
     * Adds a custom event.
     *
     * @param event The custom event.
     * @return A promise that returns null if resolved, or an Error if the
     * custom event is rejected.
     */
    static addCustomEvent(event: CustomEvent): Promise<null | Error>;
    /**
     * Runs an Urban Airship action.
     *
     * @param name The name of the action.
     * @param value The action's value.
     * @return A promise that returns the action result if the action
     * successfully runs, or the Error if the action was unable to be run.
     */
    static runAction(name: string, value?: JsonValue): Promise<JsonValue | Error>;
    /**
     * Sets the foreground presentation options for iOS.
     * This method is only supported on iOS. Android will no-op.
     *
     * @param options The array of foreground presentation options.
     */
    static setForegroundPresentationOptions(options: [iOS.ForegroundPresentationOption]): any;
    /**
     * Sets the notification options for iOS.
     * This method is only supported on iOS. Android will no-op.
     *
     * @param options The array of notification options.
     */
    static setNotificationOptions(options: [iOS.NotificationOption]): any;
    /**
     * Adds a listener for an Urban Airship event.
     *
     * @param eventType The event type. Either EventType.NotificationResponse, EventType.PushReceived,
     * EventType.Register, EventType.Registration, EventType.DeepLink, EventType.NotificationOptInStatus,
     * EventType.InboxUpdated, or EventType.ShowInbox.
     * @param listener The event listener.
     * @return A subscription.
     */
    static addListener(eventType: EventType, listener: (...args: any[]) => any): Subscription;
    /**
     * Removes a listener for an Urban Airship event.
     *
     * @param eventType The event type. Either EventType.NotificationResponse, EventType.PushReceived,
     * EventType.Register, EventType.Registration, EventType.DeepLink, EventType.NotificationOptInStatus,
     * EventType.InboxUpdated, or EventType.ShowInbox.
     * @param listener The event listener. Should be a reference to the function passed into addListener.
     */
    static removeListener(eventType: EventType, listener: (...args: any[]) => any): void;
    /**
     * Removes all listeners for Urban Airship events.
     *
     * @param eventType The event type. Either EventType.NotificationResponse, EventType.PushReceived,
     * EventType.Register, EventType.Registration, EventType.DeepLink, EventType.NotificationOptInStatus,
     * EventType.InboxUpdated, or EventType.ShowInbox.
     */
    static removeAllListeners(eventType: EventType): void;
    /**
     * Enables or disables autobadging on iOS. Badging is not supported for Android.
     *
     * @param enabled Whether or not to enable autobadging.
     */
    static setAutobadgeEnabled(enabled: boolean): void;
    /**
     * Checks to see if autobadging on iOS is enabled. Badging is not supported for Android.
     *
     * @return A promise with the result, either true or false.
     */
    static isAutobadgeEnabled(): Promise<boolean>;
    /**
     * Sets the badge number for iOS. Badging is not supported for Android.
     *
     * @param badgeNumber The badge number.
     */
    static setBadgeNumber(badgeNumber: number): void;
    /**
     * Gets the current badge number for iOS. Badging is not supported for Android
     * and this method will always return 0.
     *
     * @return A promise with the result.
     */
    static getBadgeNumber(): Promise<number>;
    /**
     * Displays the default message center.
     */
    static displayMessageCenter(): void;
    /**
     * Dismisses the default message center.
     */
    static dismissMessageCenter(): void;
    /**
     * Displays an inbox message.
     *
     * @param messageId The id of the message to be displayed.
     * @return A promise with the result.
     */
    static displayMessage(messageId: string): Promise<boolean>;
    /**
     * Dismisses the currently displayed inbox message.
     */
    static dismissMessage(): void;
    /**
     * Retrieves the current inbox messages.
     *
     * @return A promise with the result.
     */
    static getInboxMessages(): Promise<InboxMessage[]>;
    /**
     * Deletes an inbox message.
     *
     * @param messageId The id of the message to be deleted.
     * @return A promise with the result.
     */
    static deleteInboxMessage(messageId: string): Promise<boolean>;
    /**
     * Marks an inbox message as read.
     *
     * @param messageId The id of the message to be marked as read.
     * @return A promise with the result.
     */
    static markInboxMessageRead(messageId: string): Promise<boolean>;
    /**
     * Forces the inbox to refresh. This is normally not needed as the inbox will
     * automatically refresh on foreground or when a push arrives that's associated
     * with a message.
     *
     * @return{Promise.<boolean>} A promise with the result.
     */
    static refreshInbox(): Promise<boolean>;
    /**
     * Sets the default behavior when the message center is launched from a push
     * notification. If set to false the message center must be manually launched.
     *
     * @param enabled true to automatically launch the default message center, false to disable.
     */
    static setAutoLaunchDefaultMessageCenter(enabled: boolean): void;
    /**
     * Overriding the locale.
     *
     * @param localeIdentifier The locale identifier.
     */
    static setCurrentLocale(localeIdentifier: String): void;
    /**
     * Getting the locale currently used by Airship.
     *
     */
    static getCurrentLocale(): Promise<String>;
    /**
     * Resets the current locale.
     *
     */
    static clearLocale(): void;
    /**
     * Gets all the active notifications for the application.
     * Supported on Android Marshmallow (23)+ and iOS 10+.
     *
     * @return A promise with the result.
     */
    static getActiveNotifications(): Promise<PushPayload[]>;
    /**
     * Clears all notifications for the application.
     * Supported on Android and iOS 10+. For older iOS devices, you can set
     * the badge number to 0 to clear notifications.
     */
    static clearNotifications(): void;
    /**
     * Clears a specific notification.
     * Supported on Android and iOS 10+.
     *
     * @param identifier The notification identifier. The identifier will be
     * available in the PushReceived event and in the active notification response
     * under the "notificationId" field.
     */
    static clearNotification(identifier: string): void;
    /**
     * Sets the in-app message display interval on the default display coordinator.
     *
     * @param seconds The minimum number of seconds between message displays.
     */
    static setInAppAutomationDisplayInterval(seconds: number): void;
    static displayPreferenceCenter(preferenceCenterId: String): void;
    static getPreferenceCenterConfig(preferenceCenterId: String): Promise<PreferenceCenter>;
    static setUseCustomPreferenceCenterUi(useCustomUi: boolean, preferenceCenterId: String): void;
}
