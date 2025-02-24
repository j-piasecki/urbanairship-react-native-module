/* Copyright Airship and Contributors */

'use strict'

import { NativeModules, Platform } from "react-native"

import { CustomEvent } from "./CustomEvent";
import { TagGroupEditor, TagGroupOperation } from "./TagGroupEditor";
import { AttributeEditor, AttributeOperation } from "./AttributeEditor";
import { UAEventEmitter } from "./UAEventEmitter";
import { SubscriptionListEditor, SubscriptionListUpdate} from "./SubscriptionListEditor";
import { ScopedSubscriptionListEditor, ScopedSubscriptionListUpdate} from "./ScopedSubscriptionListEditor";
import { JsonObject, JsonValue } from "./Json";
import { SubscriptionLists, SubscriptionListType } from "./SubscriptionLists";

/**
 * @hidden
 */
const UrbanAirshipModule = NativeModules.UrbanAirshipReactModule

/**
 * @hidden
 */
const EventEmitter = new UAEventEmitter()

/**
 * Enum of internal event type names used by UAEventEmitter
 * @hidden
 */
enum InternalEventType {
  Registration = "com.urbanairship.registration",
  NotificationResponse = "com.urbanairship.notification_response",
  PushReceived = "com.urbanairship.push_received",
  DeepLink = "com.urbanairship.deep_link",
  InboxUpdated = "com.urbanairship.inbox_updated",
  NotificationOptInStatus = "com.urbanairship.notification_opt_in_status",
  ShowInbox = "com.urbanairship.show_inbox",
  ConversationUpdated = "com.urbanairship.conversation_updated",
  OpenChat = "com.urbanairship.open_chat",
  OpenPreferenceCenter = "com.urbanairship.open_preference_center"
}

/**
 * Enum of event type names.
 */
export enum EventType {
  /**
   * Notification response event. On Android, this event will be dispatched
   * in the background for background notifications actions.
   */
  NotificationResponse = "notificationResponse",
  /**
   * Push received event. On Android, this event will only be dispatched
   * in the background if the app is able to start a service or by sending a
   * high priority FCM message.
   */
  PushReceived = "pushReceived",
  /**
   * Register event.
   */
  Register = "register",
  /**
   * Registration event.
   */
  Registration = "registration",
  /**
   * Deep link event.
   */
  DeepLink = "deepLink",
  /**
   * Notification opt-in status event.
   */
  NotificationOptInStatus = "notificationOptInStatus",
  /**
   * Inbox updated event.
   */
  InboxUpdated = "inboxUpdated",
  /**
   * Show inbox event.
   */
  ShowInbox = "showInbox",
  /**
   * Chat conversation updated.
   */
  ConversationUpdated = "conversationUpdated",
  /**
   * Open chat event.
   */
   OpenChat = "openChat",  
   /**
   * Open preference center event.
   */
  OpenPreferenceCenter = "openPreferenceCenter"
}

/**
 * Inbox message object.
 */
export interface InboxMessage {
  /**
   * The message ID. Needed to display, mark as read, or delete the message.
   */
  id: string
  /**
   * The message title.
   */
  title: string
  /**
   * The message sent date in milliseconds.
   */
  sentDate: number
  /**
   * Optional - The icon url for the message.
   */
  listIconUrl: string
  /**
   * The unread / read status of the message.
   */
  isRead: boolean
  /**
   * The deleted status of the message.
   */
  isDeleted: boolean
  /**
   * String to String map of any message extras.
   */
  extras: Record<string, string>
}

/**
 * Event fired when a push is received.
 */
export interface PushReceivedEvent {
  /**
   * The alert.
   */
  alert?: string
  /**
   * The title.
   */
  title?: string
  /**
   * The notification ID.
   */
  notificationId: string
  /**
   * The notification extras.
   */
  extras: JsonObject
}

/**
 * Event fired when the user initiates a notification response.
 */
export interface NotificationResponseEvent {
  /**
   * The push notification.
   */
  notification: PushReceivedEvent
  /**
   * The action button ID, if available.
   */
  actionId?: string
  /**
   * Indicates whether the response was a foreground action.
   * This value is always if the user taps the main notification,
   * otherwise it is defined by the notification action button.
   */
  isForeground: boolean
}

/**
 * Airship config environment
 */
export interface ConfigEnvironment {
  /**
   * App key.
   */
  appKey: string

  /**
   * App secret.
   */
  appSecret: string

  /**
   * Optional log level.
   */
  logLevel?: LogLevel
}

/**
 * Possible sites.
 */
export type Site = "us" | "eu";

/**
 * Log levels.
 */
export type LogLevel = "verbose" | "debug" | "info" | "warning" | "error" | "none";

/**
 * Airship config
 */
export interface AirshipConfig {
  /**
   * Default environment.
   */
  default?: ConfigEnvironment,

  /**
   * Development environment. Overrides default environment if inProduction is false.
   */
  development?: ConfigEnvironment,

  /**
   * Production environment. Overrides default environment if inProduction is true.
   */
  production?: ConfigEnvironment,

  /**
   * Cloud site.
   */
  site?: Site

  /**
   * Switches the environment from development or production. If the value is not
   * set, Airship will determine the value at runtime.
   */
  inProduction?: boolean,

  /**
   * URL allow list.
   */
  urlAllowList?: string[],

  /**
   * URL allow list for open URL scope.
   */
  urlAllowListScopeOpenUrl?: string[],

  /**
   * URL allow list for JS bridge injection.
   */
  urlAllowListScopeJavaScriptInterface?: string[],

  /**
   * Enables channel capture feature.
   * This config is enabled by default.
   */
  isChannelCaptureEnabled?: boolean

  /**
  * Whether to suppress console error messages about missing allow list entries during takeOff.
  * This config is disabled by default.
  */
  suppressAllowListError?: boolean

  /**
   * Enables delayed channel creation.
   */
  isChannelCreationDelayEnabled?: boolean,

  /**
   * Initial config URL for custom Airship domains. The URL
   * should also be added to the urlAllowList.
   */
  initialConfigUrl?: String,

  /**
   * Enables/disables requiring initial remote config fetch before
   * creating a channel.
   * @deprecated This config is enabled by default.
   */
  requireInitialRemoteConfigEnabled?: boolean,

  /**
   * Enabled features. Defaults to all.
   */
  enabledFeatures?: Feature[],

  /**
   * Chat config. Only needed with the chat module.
   */
  chat?:{
    webSocketUrl: string,
    url: string
  }
  /**
   * iOS config.
   */
  ios?: {
    /**
     * itunesId for rate app and app store deep links.
     */
    itunesId?: string
  },

  /**
   * Android config.
   */
  android?: {
    /**
     * App store URI
     */
    appStoreUri?: string,

    /**
     * Fcm app name if using multiple FCM projects.
     */
    fcmFirebaseAppName?: string,
    
    /**
     * Notification config.
     */
    notificationConfig?: NotificationConfigAndroid
  }
}

/**
 * Subscription Scope types.
 */
 export enum SubscriptionScope {
  App = "app",
  Web = "web",
  Sms = "sms",
  Email = "email"
}

/**
 * iOS options
 */
export namespace iOS {

  /**
   * Enum of notification options. iOS only.
   */
  export enum NotificationOption {
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
    CarPlay = "carPlay",
    /**
     * Critical Alert.
     */
    CriticalAlert = "criticalAlert",
    /**
     * Provides app notification settings.
     */
    ProvidesAppNotificationSettings = "providesAppNotificationSettings",
    /**
     * Provisional.
     */
    Provisional = "provisional"
  }

  /**
   * Enum of foreground notification options.
   */
  export enum ForegroundPresentationOption {
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
    Badge = "badge"
  }

  /**
   * Enum of authorized notification settings.
   */
  export enum AuthorizedNotificationSetting {
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
    CarPlay = "carPlay",
    /**
     * Lock screen.
     */
    LockScreen = "lockScreen",
    /**
     * Notification center.
     */
    NotificationCenter = "notificationCenter",
    /**
     * Critical alert.
     */
    CriticalAlert = "criticalAlert",
    /**
     * Announcement.
     */
    Announcement = "announcement",
    /**
     * Scheduled delivery.
     */
    ScheduledDelivery = "scheduledDelivery",
    /**
    * Time sensitive.
    */
    TimeSensitive = "timeSensitive"
  }

  /**
   * Enum of authorized status.
   */
   export enum AuthorizedNotificationStatus {
    /**
     * Not determined.
     */
    NotDetermined = "notDetermined",
    
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
  airshipOptIn: boolean

  /**
   * If notifications are enabled on Airship or not.
   */
  airshipEnabled: boolean

  /**
   * If notifications are enabled in the app settings or not.
   */
  systemEnabled: boolean

  /**
   * iOS status.
   */
  ios?: {
    /**
     * Authorized settings.
     */
    authorizedSettings: [iOS.AuthorizedNotificationSetting],

    /**
     * Authorized status.
     */
    authorizedStatus: iOS.AuthorizedNotificationStatus
  }
}

/**
 * Enum of notification options. iOS only.
 * @deprecated This enum is poorly named and refers to foreground presentation
 * options instead of notification options. Use iOS.ForegroundPresentationOption instead.
 */
export type NotificationOptionsIOS = iOS.ForegroundPresentationOption

/**
 * A map of notification options. iOS only.
 * @deprecated Not used.
 */
export type NotificationOptionsMapIOS = { [option in iOS.ForegroundPresentationOption]: boolean }

/**
 * A map of foreground notification options. iOS only.
 * @deprecated Use iOS.ForegroundPresentationOption[] instead of a map.
 */
export type ForegroundNotificationOptionsIOS = { [option in iOS.ForegroundPresentationOption]: boolean | null | undefined }

/**
 * Enum of authorized notification settings. iOS only.
 * @deprecated Use iOS.AuthorizedNotificationSetting instead.
 */
export type AuthorizedNotificationSettingsIOS = iOS.AuthorizedNotificationSetting

/**
 * A map of authorized notification settings.
 * @deprecated Use [iOS.AuthorizedNotificationSetting] instead.
 */
export type iOSAuthorizedNotificationSettingsMap = { [setting in iOS.AuthorizedNotificationSetting]: boolean }

/**
 * Event fired when the notification opt-in status changes.
 */
export interface NotificationOptInStatusEvent {
  /**
   * Whether the user is opted in to notifications.
   */
  optIn: boolean

  /**
   * The authorized notification settings map. iOS only.
   * @deprecated Use authorizedSettings instead.
   */
  authorizedNotificationSettings?: [AuthorizedNotificationSettingsIOS]

  /**
   * The authorized notification settings. iOS only.
   */
  authorizedSettings?: [iOS.AuthorizedNotificationSetting]
}

/**
 * Event fired when the inbox is updated.
 */
export interface InboxUpdatedEvent {
  /**
   * The unread message count.
   */
  messageUnreadCount: number
  /**
   * The total message count.
   */
  messageCount: number
}

/**
 * Event fired when the message center requests the inbox to be displayed.
 */
export interface ShowInboxEvent {
  /**
   * The message ID, if available.
   */
  messageId?: string
}

/**
 * Event fired when a deep link is opened.
 */
export interface DeepLinkEvent {
  /**
   * The deep link string.
   */
  deepLink: string
}

/**
 * Event fired when a preference center requests to be displayed.
 */
 export interface OpenPreferenceCenterEvent {
  /**
   * The preference center Id.
   */
  preferenceCenterId: string
}


/**
 * A listener subscription.
 */
export class Subscription {
  onRemove: () => void
  constructor(onRemove: () => void) {
    this.onRemove = onRemove
  }
  /**
   * Removes the listener.
   */
  remove(): void {
    this.onRemove()
  }
}

/**
 * Event fired when a channel registration occurs.
 */
export interface RegistrationEvent {
  /**
   * The channel ID.
   */
  channelId: string
  /**
   * The registration token. The registration token might be undefined
   * if registration is currently in progress, if the app is not setup properly
   * for remote notifications, if running on an iOS simulator, or if running on
   * an Android device that has an outdated or missing version of Google Play Services.
   */
  registrationToken?: string
}

/**
 * Converts between public and internal event types.
 * @hidden
 */
function convertEventEnum(type: EventType): string {
  if (type === EventType.NotificationResponse) {
    return InternalEventType.NotificationResponse
  } else if (type === EventType.PushReceived) {
    return InternalEventType.PushReceived
  } else if (type === EventType.Register || type === EventType.Registration) {
    return InternalEventType.Registration
  } else if (type == EventType.DeepLink) {
    return InternalEventType.DeepLink
  } else if (type == EventType.NotificationOptInStatus) {
    return InternalEventType.NotificationOptInStatus
  } else if (type == EventType.InboxUpdated) {
    return InternalEventType.InboxUpdated
  } else if (type == EventType.ShowInbox) {
    return InternalEventType.ShowInbox
  } else if (type == EventType.ConversationUpdated) {
    return InternalEventType.ConversationUpdated
  } else if (type == EventType.OpenChat) {
    return InternalEventType.OpenChat
  } else if (type == EventType.OpenPreferenceCenter) {
    return InternalEventType.OpenPreferenceCenter
  }

  throw new Error("Invalid event name: " + type)
}

function convertFeatureEnum(feature: String): Feature {
  if (feature == "FEATURE_NONE") {
    return Feature.FEATURE_NONE
  } else if (feature == "FEATURE_IN_APP_AUTOMATION") {
    return Feature.FEATURE_IN_APP_AUTOMATION
  } else if (feature == "FEATURE_MESSAGE_CENTER") {
    return Feature.FEATURE_MESSAGE_CENTER
  } else if (feature == "FEATURE_PUSH") {
    return Feature.FEATURE_PUSH
  } else if (feature == "FEATURE_CHAT") {
    return Feature.FEATURE_CHAT
  } else if (feature == "FEATURE_ANALYTICS") {
    return Feature.FEATURE_ANALYTICS
  } else if (feature == "FEATURE_TAGS_AND_ATTRIBUTES") {
    return Feature.FEATURE_TAGS_AND_ATTRIBUTES
  } else if (feature == "FEATURE_CONTACTS") {
    return Feature.FEATURE_CONTACTS
  } else if (feature == "FEATURE_LOCATION") {
    return Feature.FEATURE_LOCATION
  } else if (feature == "FEATURE_ALL") {
    return Feature.FEATURE_ALL
  }

  throw new Error("Invalid feature name: " + feature)
}

/**
 * Android notification config.
 */
export interface NotificationConfigAndroid {
  /**
   * The icon resource name.
   */
  icon?: string
  /**
   * The large icon resource name.
   */
  largeIcon?: string
  /**
   * The default android notification channel ID.
   */
  defaultChannelId?: string
  /**
   * The accent color. Must be a hex value #AARRGGBB.
   */
  accentColor?: string
}

/**
 * Enum of authorized Features.
 */
export enum Feature {
  FEATURE_NONE = "FEATURE_NONE",
  FEATURE_IN_APP_AUTOMATION = "FEATURE_IN_APP_AUTOMATION",
  FEATURE_MESSAGE_CENTER = "FEATURE_MESSAGE_CENTER",
  FEATURE_PUSH = "FEATURE_PUSH",
  FEATURE_CHAT = "FEATURE_CHAT",
  FEATURE_ANALYTICS = "FEATURE_ANALYTICS",
  FEATURE_TAGS_AND_ATTRIBUTES = "FEATURE_TAGS_AND_ATTRIBUTES",
  FEATURE_CONTACTS = "FEATURE_CONTACTS",
  FEATURE_LOCATION = "FEATURE_LOCATION",
  FEATURE_ALL = "FEATURE_ALL"
}

/**
* The main Airship API.
*/
export class UrbanAirship {

  /**
   * Calls takeOff. If Airship is already initialized the new config will be applied on next app init.
   *
   * @param config The airship config.
   * @return A promise with the result. The result will be true if Airship is initialized, otherwise false.
   */
  static takeOff(config: AirshipConfig): Promise<boolean> {
    return UrbanAirshipModule.takeOff(config)
  }

  /**
   * Checks if Airship is initialized.
   *
   * @return A promise with the result. The result will be true if Airship is initialized, otherwise false.
   */
  static isFlying(): Promise<boolean> {
    return UrbanAirshipModule.isFlying()
  }
  
  /**
   * Sets the Android notification config. Values not set will fallback to any values set in the airship config options.
   *
   * @param config The notification config object.
   */
  static setAndroidNotificationConfig(config: NotificationConfigAndroid) {
    UrbanAirshipModule.setAndroidNotificationConfig(config)
  }

  /**
   * Sets user notifications enabled. The first time user notifications are enabled
   * on iOS, it will prompt the user for notification permissions.
   *
   * @param enabled true to enable notifications, false to disable.
   */
  static setUserNotificationsEnabled(enabled: boolean) {
    UrbanAirshipModule.setUserNotificationsEnabled(enabled)
  }

  /**
   * Checks if user notifications are enabled or not.
   *
   * @return A promise with the result.
   */
  static isUserNotificationsEnabled(): Promise<boolean> {
    return UrbanAirshipModule.isUserNotificationsEnabled()
  }

  /**
   * Sets the SDK features that will be enabled. The rest of the features will be disabled.
   * 
   * If all features are disabled the SDK will not make any network requests or collect data.
   *
   * @note All features are enabled by default.
   * @param feature An array of `Features` to enable.
   * @return A promise that returns true if the enablement was authorized.
   */
  static setEnabledFeatures(features: Feature[]): Promise<boolean> {
    return UrbanAirshipModule.setEnabledFeatures(features)
  }

  /**
   * Gets a Feature array with the enabled features.
   * 
   * @return A promise that returns the enabled features as a Feature array.
   */
  static getEnabledFeatures(): Promise<Feature[]> {
    return new Promise((resolve, reject) => {
      UrbanAirshipModule.getEnabledFeatures().then((features: String[]) => {
        var convertedFeatures: Feature[] = new Array()        
        for (const feature of features){
          convertedFeatures.push(convertFeatureEnum(feature))
        }
        resolve(convertedFeatures)
      }), (error: Error) => {
        reject(error)
      }
    })
  }

  /**
   * Enables one or many features.
   *
   * @param feature An array of `Feature` to enable.
   * @return A promise that returns true if the enablement was authorized.
   */
  static enableFeature(features: Feature[]): Promise<boolean> {
    return UrbanAirshipModule.enableFeature(features)
  }

  /**
   * Disables one or many features.
   *
   * @param feature An array of `Feature` to disable.
   * @return A promise that returns true if the disablement was authorized.
   */
  static disableFeature(features: Feature[]): Promise<boolean> {
    return UrbanAirshipModule.disableFeature(features)
  }

  /**
   * Checks if a given feature is enabled or not.
   *
   * @return A promise that returns true if the features are enabled, false otherwise.
   */
  static isFeatureEnabled(features: Feature[]): Promise<boolean> {
    return UrbanAirshipModule.isFeatureEnabled(features)
  }

  /**
   * Enables user notifications.
   *
   * @return A promise that returns true if enablement was authorized
   * or false if enablement was rejected
   */
  static enableUserPushNotifications(): Promise<boolean> {
    return UrbanAirshipModule.enableUserPushNotifications()
  }

  /**
   * Enables channel creation if `channelCreationDelayEnabled` was
   * enabled in the config.
   */
  static enableChannelCreation() {
    UrbanAirshipModule.enableChannelCreation()
  }

  /**
   * Gets the count of Unread messages in the inbox.
   */
  static getUnreadMessageCount(): Promise<number> {
    return UrbanAirshipModule.getUnreadMessagesCount();
  }

  /**
   * Checks if app notifications are enabled or not. Its possible to have `userNotificationsEnabled`
   * but app notifications being disabled if the user opted out of notifications.
   *
   * @return A promise with the result.
   * @deprecated Use getNotificationStatus() instead.
   */
  static isUserNotificationsOptedIn(): Promise<boolean> {
    return UrbanAirshipModule.isUserNotificationsOptedIn()
  }

  /**
   * Checks if app notifications are enabled at a system level or not. Its possible to have `userNotificationsEnabled`
   * but app notifications being disabled if the user opted out of notifications.
   *
   * @return A promise with the result.
   * @deprecated Use getNotificationStatus() instead.
   */
  static isSystemNotificationsEnabledForApp(): Promise<boolean> {
    return UrbanAirshipModule.isSystemNotificationsEnabledForApp()
  }

  /**
   * Gets the notification status for the app.
   *
   * @return A promise with the result.
   */
  static getNotificationStatus(): Promise<NotificationStatus> {
    return UrbanAirshipModule.getNotificationStatus()
  }

  /**
   * Gets the status of the specified Notification Channel.
   * This method is only supported on Android. iOS will throw an error.
   *
   * @param channel The channel's name.
   * @return A promise with the result.
   */
  static getNotificationChannelStatus(channel: string): Promise<string> {
    if (Platform.OS != 'android') {
      throw new Error("This method is only supported on Android devices.")
    }
    return UrbanAirshipModule.getNotificationChannelStatus(channel)
  }

  /**
   * Sets the named user.
   *
   * @param namedUser The named user string, or null/undefined to clear the named user.
   */
  static setNamedUser(namedUser: string | null | undefined) {
    UrbanAirshipModule.setNamedUser(namedUser)
  }

  /**
   * Gets the named user.
   *
   * @return A promise with the result.
   */
  static getNamedUser(): Promise<string | null | undefined> {
    return UrbanAirshipModule.getNamedUser()
  }

  /**
   * Adds a channel tag.
   *
   * @param tag A channel tag.
   */
  static addTag(tag: string) {
    UrbanAirshipModule.addTag(tag)
  }

  /**
   * Removes a channel tag.
   *
   * @param tag A channel tag.
   */
  static removeTag(tag: string) {
    UrbanAirshipModule.removeTag(tag)
  }

  /**
   * Gets the channel tags.
   *
   * @return A promise with the result.
   */
  static getTags(): Promise<string[]> {
    return UrbanAirshipModule.getTags()
  }

  /**
   * Gets the subscription lists.
   *
   * @param types The types of subscription lists. Values: `channel`, `contact` (default: [`channel`]).
   * @return A promise with the result.
   */
   static getSubscriptionLists(types?: [...SubscriptionListType[]]): Promise<SubscriptionLists> {
    return UrbanAirshipModule.getSubscriptionLists(types ?? ['channel']);
  }

  /**
   * Creates an editor to modify the named user tag groups.
   *
   * @return A tag group editor instance.
   * @deprecated Replaced by {@link editContactTagGroups()}.
   */
  static editNamedUserTagGroups(): TagGroupEditor {
    return this.editContactTagGroups()
  }

  /**
   * Creates an editor to modify the contact tag groups.
   *
   * @return A tag group editor instance.
   */
   static editContactTagGroups(): TagGroupEditor {
    return new TagGroupEditor((operations: TagGroupOperation[]) => {
      UrbanAirshipModule.editContactTagGroups(operations)
    })
  }

  /**
   * Creates an editor to modify the channel tag groups.
   *
   * @return A tag group editor instance.
   */
  static editChannelTagGroups(): TagGroupEditor {
    return new TagGroupEditor((operations: TagGroupOperation[]) => {
      UrbanAirshipModule.editChannelTagGroups(operations)
    })
  }

  /**
   * Creates an editor to modify the channel attributes.
   *
   * @return An attribute editor instance.
   */
  static editChannelAttributes(): AttributeEditor {
    return new AttributeEditor((operations: AttributeOperation[]) => {
      UrbanAirshipModule.editChannelAttributes(operations)
    })
  }

  /**
   * Creates an editor to modify the named user attributes.
   *
   * @return An attribute editor instance.
   * @deprecated Replaced by {@link editContactAttributes()}.
   */
  static editNamedUserAttributes(): AttributeEditor {
    return this.editContactAttributes()
  }

  /**
   * Creates an editor to modify the contact attributes.
   *
   * @return An attribute editor instance.
   */
  static editContactAttributes(): AttributeEditor {
    return new AttributeEditor((operations: AttributeOperation[]) => {
      UrbanAirshipModule.editContactAttributes(operations)
    })
  }

  /**
   * Edit the subscription List.
   *
   * @return A promise with the result.
   * @deprecated Replaced by {@link editChannelSubscriptionLists()}.
   */
  static editSubscriptionLists(): SubscriptionListEditor {
    return this.editChannelSubscriptionLists()
  }

  /**
   * Edit the subscription lists associated with the current Channel.
   *
   * @return A promise with the result.
   */
  static editChannelSubscriptionLists(): SubscriptionListEditor {
    return new SubscriptionListEditor((subscriptionListUpdates: SubscriptionListUpdate[]) => {
        UrbanAirshipModule.editChannelSubscriptionLists(subscriptionListUpdates)
    })
  }

  /**
   * Edit the subscription lists associated with the current Contact.
   *
   * @return A promise with the result.
   */
  static editContactSubscriptionLists(): ScopedSubscriptionListEditor {
    return new ScopedSubscriptionListEditor((subscriptionListUpdates: ScopedSubscriptionListUpdate[]) => {
        UrbanAirshipModule.editContactSubscriptionLists(subscriptionListUpdates)
    })
  }

  /**
   * Enables or disables analytics.
   *
   * Disabling analytics will delete any locally stored events
   * and prevent any events from uploading. Features that depend on analytics being
   * enabled may not work properly if it's disabled (reports, region triggers,
   * location segmentation, push to local time).
   *
   * @param enabled true to enable notifications, false to disable.
   */
  static setAnalyticsEnabled(enabled: boolean) {
    UrbanAirshipModule.setAnalyticsEnabled(enabled)
  }

  /**
   * Checks if analytics is enabled or not.
   *
   * @return A promise with the result.
   */
  static isAnalyticsEnabled(): Promise<boolean> {
    return UrbanAirshipModule.isAnalyticsEnabled()
  }

  /**
   * Initiates screen tracking for a specific app screen, must be called once per tracked screen.
   *
   * @param screen The screen's string identifier
   */
  static trackScreen(screen: string) {
    UrbanAirshipModule.trackScreen(screen)
  }

  /**
   * Gets the channel ID.
   *
   * @return A promise with the result.
   */
  static getChannelId(): Promise<string | null | undefined> {
    return UrbanAirshipModule.getChannelId()
  }

  /**
   * Gets the registration token.
   *
   * @return A promise with the result. The registration token might be undefined
   * if registration is currently in progress, if the app is not setup properly
   * for remote notifications, if running on an iOS simulator, or if running on
   * an Android device that has an outdated or missing version of Google Play Services.
   */
  static getRegistrationToken(): Promise<string | null | undefined> {
    return UrbanAirshipModule.getRegistrationToken()
  }

  /**
   * Associates an identifier for the Connect data stream.
   *
   * @param key The identifier's key.
   * @param id The identifier's id, or null/undefined to clear.
   */
  static associateIdentifier(key: string, id?: string) {
    UrbanAirshipModule.associateIdentifier(key, id)
  }

  /**
   * Adds a custom event.
   *
   * @param event The custom event.
   * @return A promise that returns null if resolved, or an Error if the
   * custom event is rejected.
   */
  static addCustomEvent(event: CustomEvent): Promise<null | Error> {
    const actionArg = {
      event_name: event._name,
      event_value: event._value,
      transaction_id: event._transactionId,
      properties: event._properties
    }

    return new Promise((resolve, reject) => {
      UrbanAirshipModule.runAction("add_custom_event_action", actionArg).then(() => {
        resolve(null)
      }, (error: Error) => {
        reject(error)
      })
    })
  }

  /**
   * Runs an Urban Airship action.
   *
   * @param name The name of the action.
   * @param value The action's value.
   * @return A promise that returns the action result if the action
   * successfully runs, or the Error if the action was unable to be run.
   */
  static runAction(name: string, value?: JsonValue): Promise<JsonValue | Error> {
    return UrbanAirshipModule.runAction(name, value)
  }

  /**
   * Sets the foreground presentation options for iOS.
   * This method is only supported on iOS. Android will no-op.
   *
   * @param options The array of foreground presentation options.
   */
  static setForegroundPresentationOptions(options: ForegroundNotificationOptionsIOS | [iOS.ForegroundPresentationOption]) {
    if (Platform.OS == 'ios') {
      if (Array.isArray(options)) {
        return UrbanAirshipModule.setForegroundPresentationOptions(options)
      } else {
        var converted = []
        if (options.alert) {
          converted.push(iOS.ForegroundPresentationOption.Alert)
        } 
        if (options.badge) {
          converted.push(iOS.ForegroundPresentationOption.Badge)
        } 
        if (options.sound) {
          converted.push(iOS.ForegroundPresentationOption.Sound)
        } 
        return UrbanAirshipModule.setForegroundPresentationOptions(converted)
      }
    }
  }

  /**
   * Sets the notification options for iOS.
   * This method is only supported on iOS. Android will no-op.
   *
   * @param options The array of notification options.
   */
   static setNotificationOptions(options: [iOS.NotificationOption]) {
    if (Platform.OS == 'ios') {
      return UrbanAirshipModule.setNotificationOptions(options)
    }
  }

  /**
   * Adds a listener for an Urban Airship event.
   *
   * @param eventType The event type. Either EventType.NotificationResponse, EventType.PushReceived,
   * EventType.Register, EventType.Registration, EventType.DeepLink, EventType.NotificationOptInStatus,
   * EventType.InboxUpdated, or EventType.ShowInbox.
   * @param listener The event listener.
   * @return A subscription.
   */
  static addListener(eventType: EventType, listener: (...args: any[]) => any): Subscription {
    EventEmitter.addListener(convertEventEnum(eventType), listener)
    return new Subscription(() => {
      UrbanAirship.removeListener(eventType, listener)
    })
  }

  /**
   * Removes a listener for an Urban Airship event.
   *
   * @param eventType The event type. Either EventType.NotificationResponse, EventType.PushReceived,
   * EventType.Register, EventType.Registration, EventType.DeepLink, EventType.NotificationOptInStatus,
   * EventType.InboxUpdated, or EventType.ShowInbox.
   * @param listener The event listener. Should be a reference to the function passed into addListener.
   */
  static removeListener(eventType: EventType, listener: (...args: any[]) => any) {
    EventEmitter.removeListener(convertEventEnum(eventType), listener)
  }

  /**
   * Removes all listeners for Urban Airship events.
   *
   * @param eventType The event type. Either EventType.NotificationResponse, EventType.PushReceived,
   * EventType.Register, EventType.Registration, EventType.DeepLink, EventType.NotificationOptInStatus,
   * EventType.InboxUpdated, or EventType.ShowInbox.
   */
  static removeAllListeners(eventType: EventType) {
    EventEmitter.removeAllListeners(convertEventEnum(eventType))
  }

  /**
   * Enables or disables autobadging on iOS. Badging is not supported for Android.
   *
   * @param enabled Whether or not to enable autobadging.
   */
  static setAutobadgeEnabled(enabled: boolean) {
    if (Platform.OS == 'ios') {
      UrbanAirshipModule.setAutobadgeEnabled(enabled)
    } else {
      console.log("This feature is not supported on this platform.")
    }
  }

  /**
   * Checks to see if autobadging on iOS is enabled. Badging is not supported for Android.
   *
   * @return A promise with the result, either true or false.
   */
  static isAutobadgeEnabled(): Promise<boolean> {
    if (Platform.OS == 'ios') {
      return UrbanAirshipModule.isAutobadgeEnabled()
    } else {
      console.log("This feature is not supported on this platform.")
      return new Promise(resolve => resolve(false))
    }
  }

  /**
   * Sets the badge number for iOS. Badging is not supported for Android.
   *
   * @param badgeNumber The badge number.
   */
  static setBadgeNumber(badgeNumber: number) {
    if (Platform.OS == 'ios') {
      UrbanAirshipModule.setBadgeNumber(badgeNumber)
    } else {
      console.log("This feature is not supported on this platform.")
    }
  }

  /**
   * Gets the current badge number for iOS. Badging is not supported for Android
   * and this method will always return 0.
   *
   * @return A promise with the result.
   */
  static getBadgeNumber(): Promise<number> {
    if (Platform.OS != 'ios') {
      console.log("This feature is not supported on this platform.")
    }
    return UrbanAirshipModule.getBadgeNumber()
  }

  /**
   * Displays the default message center.
   */
  static displayMessageCenter() {
    UrbanAirshipModule.displayMessageCenter()
  }

  /**
   * Dismisses the default message center.
   */
  static dismissMessageCenter() {
    UrbanAirshipModule.dismissMessageCenter()
  }

  /**
   * Displays an inbox message.
   *
   * @param messageId The id of the message to be displayed.
   * @return A promise with the result.
   */
  static displayMessage(messageId: string): Promise<boolean> {
    return UrbanAirshipModule.displayMessage(messageId)
  }

  /**
   * Dismisses the currently displayed inbox message.
   */
  static dismissMessage() {
    UrbanAirshipModule.dismissMessage()
  }

  /**
   * Retrieves the current inbox messages.
   *
   * @return A promise with the result.
   */
  static getInboxMessages(): Promise<InboxMessage[]> {
    return UrbanAirshipModule.getInboxMessages()
  }

  /**
   * Deletes an inbox message.
   *
   * @param messageId The id of the message to be deleted.
   * @return A promise with the result.
   */
  static deleteInboxMessage(messageId: string): Promise<boolean> {
    return UrbanAirshipModule.deleteInboxMessage(messageId)
  }

  /**
   * Marks an inbox message as read.
   *
   * @param messageId The id of the message to be marked as read.
   * @return A promise with the result.
   */
  static markInboxMessageRead(messageId: string): Promise<boolean> {
    return UrbanAirshipModule.markInboxMessageRead(messageId)
  }

  /**
   * Forces the inbox to refresh. This is normally not needed as the inbox will
   * automatically refresh on foreground or when a push arrives that's associated
   * with a message.
   *
   * @return{Promise.<boolean>} A promise with the result.
   */
  static refreshInbox(): Promise<boolean> {
    return UrbanAirshipModule.refreshInbox()
  }

  /**
   * Sets the default behavior when the message center is launched from a push
   * notification. If set to false the message center must be manually launched.
   *
   * @param enabled true to automatically launch the default message center, false to disable.
   */
  static setAutoLaunchDefaultMessageCenter(enabled: boolean) {
    UrbanAirshipModule.setAutoLaunchDefaultMessageCenter(enabled)
  }

  /**
   * Overriding the locale.
   *
   * @param localeIdentifier The locale identifier.
   */
  static setCurrentLocale(localeIdentifier: String) {
    UrbanAirshipModule.setCurrentLocale(localeIdentifier)
  }

  /**
   * Getting the locale currently used by Airship.
   *
   */
  static getCurrentLocale(): Promise<String> {
    return UrbanAirshipModule.getCurrentLocale()
  }

  /**
   * Resets the current locale.
   *
   */
  static clearLocale() {
    UrbanAirshipModule.clearLocale()
  }

  /**
   * Gets all the active notifications for the application.
   * Supported on Android Marshmallow (23)+ and iOS 10+.
   *
   * @return A promise with the result.
   */
  static getActiveNotifications(): Promise<PushReceivedEvent[]> {
    return UrbanAirshipModule.getActiveNotifications()
  }

  /**
   * Clears all notifications for the application.
   * Supported on Android and iOS 10+. For older iOS devices, you can set
   * the badge number to 0 to clear notifications.
   */
  static clearNotifications() {
    UrbanAirshipModule.clearNotifications()
  }

  /**
   * Clears a specific notification.
   * Supported on Android and iOS 10+.
   *
   * @param identifier The notification identifier. The identifier will be
   * available in the PushReceived event and in the active notification response
   * under the "notificationId" field.
   */
  static clearNotification(identifier: string) {
    UrbanAirshipModule.clearNotification(identifier)
  }

  /**
   * Sets the in-app message display interval on the default display coordinator.
   *
   * @param seconds The minimum number of seconds between message displays.
   */
  static setInAppAutomationDisplayInterval(seconds: number) {
    UrbanAirshipModule.setInAppAutomationDisplayInterval(seconds)
  }
}
