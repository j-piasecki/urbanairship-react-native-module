/* Copyright Airship and Contributors */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.iOS = exports.UrbanAirship = exports.SubscriptionScope = exports.Subscription = exports.Feature = exports.EventType = void 0;
var _reactNative = require("react-native");
var _TagGroupEditor = require("./TagGroupEditor");
var _AttributeEditor = require("./AttributeEditor");
var _UAEventEmitter = require("./UAEventEmitter");
var _SubscriptionListEditor = require("./SubscriptionListEditor");
var _ScopedSubscriptionListEditor = require("./ScopedSubscriptionListEditor");
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * @hidden
 */
const UrbanAirshipModule = _reactNative.NativeModules.UrbanAirshipReactModule;

/**
 * @hidden
 */
const EventEmitter = new _UAEventEmitter.UAEventEmitter();

/**
 * Enum of internal event type names used by UAEventEmitter
 * @hidden
 */
var InternalEventType;
/**
 * Enum of event type names.
 */
(function (InternalEventType) {
  InternalEventType["ChannelCreated"] = "com.airship.channel_created";
  InternalEventType["NotificationResponse"] = "com.airship.notification_response";
  InternalEventType["PushReceived"] = "com.airship.push_received";
  InternalEventType["DeepLink"] = "com.airship.deep_link";
  InternalEventType["MessageCenterUpdated"] = "com.airship.message_center_updated";
  InternalEventType["NotificationOptInStatus"] = "com.airship.notification_opt_in_status";
  InternalEventType["DisplayMessageCenter"] = "com.airship.display_message_center";
  InternalEventType["DisplayPreferenceCenter"] = "com.airship.display_preference_center";
  InternalEventType["PushTokenReceived"] = "com.airship.push_token_received";
})(InternalEventType || (InternalEventType = {}));
let EventType;
/**
 * Inbox message object.
 */
exports.EventType = EventType;
(function (EventType) {
  EventType["NotificationResponse"] = "notification_response";
  EventType["PushReceived"] = "push_received";
  EventType["ChannelCreated"] = "channel_created";
  EventType["DeepLink"] = "deep_link";
  EventType["NotificationOptInStatus"] = "notification_opt_in_status";
  EventType["MessageCenterUpdated"] = "message_center_updated";
  EventType["DisplayMessageCenter"] = "display_message_center";
  EventType["DisplayPreferenceCenter"] = "display_preference_center";
  EventType["PushTokenReceived"] = "push_token_received";
})(EventType || (exports.EventType = EventType = {}));
/**
 * Subscription Scope types.
 */
let SubscriptionScope;
/**
 * iOS options
 */
exports.SubscriptionScope = SubscriptionScope;
(function (SubscriptionScope) {
  SubscriptionScope["App"] = "app";
  SubscriptionScope["Web"] = "web";
  SubscriptionScope["Sms"] = "sms";
  SubscriptionScope["Email"] = "email";
})(SubscriptionScope || (exports.SubscriptionScope = SubscriptionScope = {}));
let iOS;
exports.iOS = iOS;
(function (_iOS) {
  let NotificationOption;
  (function (NotificationOption) {
    NotificationOption["Alert"] = "alert";
    NotificationOption["Sound"] = "sound";
    NotificationOption["Badge"] = "badge";
    NotificationOption["CarPlay"] = "car_play";
    NotificationOption["CriticalAlert"] = "critical_alert";
    NotificationOption["ProvidesAppNotificationSettings"] = "provides_app_notification_settings";
    NotificationOption["Provisional"] = "provisional";
  })(NotificationOption || (NotificationOption = {}));
  _iOS.NotificationOption = NotificationOption;
  let ForegroundPresentationOption;
  (function (ForegroundPresentationOption) {
    ForegroundPresentationOption["Sound"] = "sound";
    ForegroundPresentationOption["Badge"] = "badge";
    ForegroundPresentationOption["List"] = "list";
    ForegroundPresentationOption["Banner"] = "banner";
  })(ForegroundPresentationOption || (ForegroundPresentationOption = {}));
  _iOS.ForegroundPresentationOption = ForegroundPresentationOption;
  let AuthorizedNotificationSetting;
  (function (AuthorizedNotificationSetting) {
    AuthorizedNotificationSetting["Alert"] = "alert";
    AuthorizedNotificationSetting["Sound"] = "sound";
    AuthorizedNotificationSetting["Badge"] = "badge";
    AuthorizedNotificationSetting["CarPlay"] = "car_play";
    AuthorizedNotificationSetting["LockScreen"] = "lock_screen";
    AuthorizedNotificationSetting["NotificationCenter"] = "notification_center";
    AuthorizedNotificationSetting["CriticalAlert"] = "critical_alert";
    AuthorizedNotificationSetting["Announcement"] = "announcement";
    AuthorizedNotificationSetting["ScheduledDelivery"] = "scheduled_delivery";
    AuthorizedNotificationSetting["TimeSensitive"] = "time_sensitive";
  })(AuthorizedNotificationSetting || (AuthorizedNotificationSetting = {}));
  _iOS.AuthorizedNotificationSetting = AuthorizedNotificationSetting;
  let AuthorizedNotificationStatus;
  (function (AuthorizedNotificationStatus) {
    AuthorizedNotificationStatus["NotDetermined"] = "not_determined";
    AuthorizedNotificationStatus["Denied"] = "denied";
    AuthorizedNotificationStatus["Authorized"] = "authorized";
    AuthorizedNotificationStatus["Provisional"] = "provisional";
    AuthorizedNotificationStatus["Ephemeral"] = "ephemeral";
  })(AuthorizedNotificationStatus || (AuthorizedNotificationStatus = {}));
  _iOS.AuthorizedNotificationStatus = AuthorizedNotificationStatus;
})(iOS || (exports.iOS = iOS = {}));
/**
 * A listener subscription.
 */
class Subscription {
  constructor(onRemove) {
    _defineProperty(this, "onRemove", void 0);
    this.onRemove = onRemove;
  }
  /**
   * Removes the listener.
   */
  remove() {
    this.onRemove();
  }
}

/**
 * Event fired when a channel registration occurs.
 */
exports.Subscription = Subscription;
/**
 * Converts between public and internal event types.
 * @hidden
 */
function convertEventEnum(type) {
  if (type === EventType.NotificationResponse) {
    return InternalEventType.NotificationResponse;
  } else if (type === EventType.PushReceived) {
    return InternalEventType.PushReceived;
  } else if (type === EventType.ChannelCreated) {
    return InternalEventType.ChannelCreated;
  } else if (type == EventType.DeepLink) {
    return InternalEventType.DeepLink;
  } else if (type == EventType.NotificationOptInStatus) {
    return InternalEventType.NotificationOptInStatus;
  } else if (type == EventType.MessageCenterUpdated) {
    return InternalEventType.MessageCenterUpdated;
  } else if (type == EventType.DisplayMessageCenter) {
    return InternalEventType.DisplayMessageCenter;
  } else if (type == EventType.DisplayPreferenceCenter) {
    return InternalEventType.DisplayPreferenceCenter;
  } else if (type == EventType.PushTokenReceived) {
    return InternalEventType.PushTokenReceived;
  }
  throw new Error("Invalid event name: " + type);
}

/**
 * Android notification config.
 */
/**
 * Enum of authorized Features.
 */
let Feature;
/**
* The main Airship API.
*/
exports.Feature = Feature;
(function (Feature) {
  Feature["None"] = "none";
  Feature["InAppAutomation"] = "in_app_automation";
  Feature["MessageCenter"] = "message_center";
  Feature["Push"] = "push";
  Feature["Chat"] = "chat";
  Feature["Analytics"] = "analytics";
  Feature["TagsAndAttributes"] = "tags_and_attributes";
  Feature["Contacts"] = "contacts";
  Feature["Location"] = "location";
  Feature["All"] = "all";
})(Feature || (exports.Feature = Feature = {}));
class UrbanAirship {
  /**
   * Calls takeOff. If Airship is already initialized the new config will be applied on next app init.
   *
   * @param config The airship config.
   * @return A promise with the result. The result will be true if Airship is initialized, otherwise false.
   */
  static takeOff(config) {
    return UrbanAirshipModule.takeOff(config);
  }

  /**
   * Checks if Airship is initialized.
   *
   * @return A promise with the result. The result will be true if Airship is initialized, otherwise false.
   */
  static isFlying() {
    return UrbanAirshipModule.isFlying();
  }

  /**
   * Sets the Android notification config. Values not set will fallback to any values set in the airship config options.
   *
   * @param config The notification config object.
   */
  static setAndroidNotificationConfig(config) {
    UrbanAirshipModule.setAndroidNotificationConfig(config);
  }

  /**
   * Sets user notifications enabled. The first time user notifications are enabled
   * on iOS, it will prompt the user for notification permissions.
   *
   * @param enabled true to enable notifications, false to disable.
   */
  static setUserNotificationsEnabled(enabled) {
    UrbanAirshipModule.setUserNotificationsEnabled(enabled);
  }

  /**
   * Checks if user notifications are enabled or not.
   *
   * @return A promise with the result.
   */
  static isUserNotificationsEnabled() {
    return UrbanAirshipModule.isUserNotificationsEnabled();
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
  static setEnabledFeatures(features) {
    return UrbanAirshipModule.setEnabledFeatures(features);
  }

  /**
   * Gets a Feature array with the enabled features.
   * 
   * @return A promise that returns the enabled features as a Feature array.
   */
  static getEnabledFeatures() {
    return UrbanAirshipModule.getEnabledFeatures();
  }

  /**
   * Enables one or many features.
   *
   * @param feature An array of `Feature` to enable.
   * @return A promise that returns true if the enablement was authorized.
   */
  static enableFeature(features) {
    return UrbanAirshipModule.enableFeature(features);
  }

  /**
   * Disables one or many features.
   *
   * @param feature An array of `Feature` to disable.
   * @return A promise that returns true if the disablement was authorized.
   */
  static disableFeature(features) {
    return UrbanAirshipModule.disableFeature(features);
  }

  /**
   * Checks if a given feature is enabled or not.
   *
   * @return A promise that returns true if the features are enabled, false otherwise.
   */
  static isFeatureEnabled(features) {
    return UrbanAirshipModule.isFeatureEnabled(features);
  }

  /**
   * Enables user notifications.
   *
   * @return A promise that returns true if enablement was authorized
   * or false if enablement was rejected
   */
  static enableUserPushNotifications() {
    return UrbanAirshipModule.enableUserPushNotifications();
  }

  /**
   * Enables channel creation if `channelCreationDelayEnabled` was
   * enabled in the config.
   */
  static enableChannelCreation() {
    UrbanAirshipModule.enableChannelCreation();
  }

  /**
   * Gets the count of Unread messages in the inbox.
   */
  static getUnreadMessageCount() {
    return UrbanAirshipModule.getUnreadMessageCount();
  }

  /**
   * Gets the notification status for the app.
   *
   * @return A promise with the result.
   */
  static getNotificationStatus() {
    return UrbanAirshipModule.getNotificationStatus();
  }

  /**
   * Gets the status of the specified Notification Channel.
   * This method is only supported on Android. iOS will throw an error.
   *
   * @param channel The channel's name.
   * @return A promise with the result.
   */
  static getNotificationChannelStatus(channel) {
    if (_reactNative.Platform.OS != 'android') {
      throw new Error("This method is only supported on Android devices.");
    }
    return UrbanAirshipModule.getNotificationChannelStatus(channel);
  }

  /**
   * Sets the named user.
   *
   * @param namedUser The named user string, or null/undefined to clear the named user.
   */
  static setNamedUser(namedUser) {
    UrbanAirshipModule.setNamedUser(namedUser);
  }

  /**
   * Gets the named user.
   *
   * @return A promise with the result.
   */
  static getNamedUser() {
    return UrbanAirshipModule.getNamedUser();
  }

  /**
   * Adds a channel tag.
   *
   * @param tag A channel tag.
   */
  static addTag(tag) {
    UrbanAirshipModule.addTag(tag);
  }

  /**
   * Removes a channel tag.
   *
   * @param tag A channel tag.
   */
  static removeTag(tag) {
    UrbanAirshipModule.removeTag(tag);
  }

  /**
   * Gets the channel tags.
   *
   * @return A promise with the result.
   */
  static getTags() {
    return UrbanAirshipModule.getTags();
  }

  /**
   * Gets the subscription lists.
   *
   * @param types The types of subscription lists. Values: `channel`, `contact` (default: [`channel`]).
   * @return A promise with the result.
   */
  static getSubscriptionLists(types) {
    return UrbanAirshipModule.getSubscriptionLists(types !== null && types !== void 0 ? types : ['channel']);
  }

  /**
   * Creates an editor to modify the contact tag groups.
   *
   * @return A tag group editor instance.
   */
  static editContactTagGroups() {
    return new _TagGroupEditor.TagGroupEditor(operations => {
      UrbanAirshipModule.editContactTagGroups(operations);
    });
  }

  /**
   * Creates an editor to modify the channel tag groups.
   *
   * @return A tag group editor instance.
   */
  static editChannelTagGroups() {
    return new _TagGroupEditor.TagGroupEditor(operations => {
      UrbanAirshipModule.editChannelTagGroups(operations);
    });
  }

  /**
   * Creates an editor to modify the channel attributes.
   *
   * @return An attribute editor instance.
   */
  static editChannelAttributes() {
    return new _AttributeEditor.AttributeEditor(operations => {
      UrbanAirshipModule.editChannelAttributes(operations);
    });
  }

  /**
   * Creates an editor to modify the contact attributes.
   *
   * @return An attribute editor instance.
   */
  static editContactAttributes() {
    return new _AttributeEditor.AttributeEditor(operations => {
      UrbanAirshipModule.editContactAttributes(operations);
    });
  }

  /**
   * Edit the subscription lists associated with the current Channel.
   *
   * @return A promise with the result.
   */
  static editChannelSubscriptionLists() {
    return new _SubscriptionListEditor.SubscriptionListEditor(subscriptionListUpdates => {
      UrbanAirshipModule.editChannelSubscriptionLists(subscriptionListUpdates);
    });
  }

  /**
   * Edit the subscription lists associated with the current Contact.
   *
   * @return A promise with the result.
   */
  static editContactSubscriptionLists() {
    return new _ScopedSubscriptionListEditor.ScopedSubscriptionListEditor(subscriptionListUpdates => {
      UrbanAirshipModule.editContactSubscriptionLists(subscriptionListUpdates);
    });
  }

  /**
   * Initiates screen tracking for a specific app screen, must be called once per tracked screen.
   *
   * @param screen The screen's string identifier
   */
  static trackScreen(screen) {
    UrbanAirshipModule.trackScreen(screen);
  }

  /**
   * Gets the channel ID.
   *
   * @return A promise with the result.
   */
  static getChannelId() {
    return UrbanAirshipModule.getChannelId();
  }

  /**
   * Gets the registration token.
   *
   * @return A promise with the result. The registration token might be undefined
   * if registration is currently in progress, if the app is not setup properly
   * for remote notifications, if running on an iOS simulator, or if running on
   * an Android device that has an outdated or missing version of Google Play Services.
   */
  static getRegistrationToken() {
    return UrbanAirshipModule.getRegistrationToken();
  }

  /**
   * Associates an identifier for the Connect data stream.
   *
   * @param key The identifier's key.
   * @param id The identifier's id, or null/undefined to clear.
   */
  static associateIdentifier(key, id) {
    UrbanAirshipModule.associateIdentifier(key, id);
  }

  /**
   * Adds a custom event.
   *
   * @param event The custom event.
   * @return A promise that returns null if resolved, or an Error if the
   * custom event is rejected.
   */
  static addCustomEvent(event) {
    const actionArg = {
      event_name: event._name,
      event_value: event._value,
      transaction_id: event._transactionId,
      properties: event._properties
    };
    return new Promise((resolve, reject) => {
      UrbanAirshipModule.runAction("add_custom_event_action", actionArg).then(() => {
        resolve(null);
      }, error => {
        reject(error);
      });
    });
  }

  /**
   * Runs an Urban Airship action.
   *
   * @param name The name of the action.
   * @param value The action's value.
   * @return A promise that returns the action result if the action
   * successfully runs, or the Error if the action was unable to be run.
   */
  static runAction(name, value) {
    return UrbanAirshipModule.runAction(name, value);
  }

  /**
   * Sets the foreground presentation options for iOS.
   * This method is only supported on iOS. Android will no-op.
   *
   * @param options The array of foreground presentation options.
   */
  static setForegroundPresentationOptions(options) {
    if (_reactNative.Platform.OS == 'ios') {
      return UrbanAirshipModule.setForegroundPresentationOptions(options);
    }
  }

  /**
   * Sets the notification options for iOS.
   * This method is only supported on iOS. Android will no-op.
   *
   * @param options The array of notification options.
   */
  static setNotificationOptions(options) {
    if (_reactNative.Platform.OS == 'ios') {
      return UrbanAirshipModule.setNotificationOptions(options);
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
  static addListener(eventType, listener) {
    EventEmitter.addListener(convertEventEnum(eventType), listener);
    return new Subscription(() => {
      UrbanAirship.removeListener(eventType, listener);
    });
  }

  /**
   * Removes a listener for an Urban Airship event.
   *
   * @param eventType The event type. Either EventType.NotificationResponse, EventType.PushReceived,
   * EventType.Register, EventType.Registration, EventType.DeepLink, EventType.NotificationOptInStatus,
   * EventType.InboxUpdated, or EventType.ShowInbox.
   * @param listener The event listener. Should be a reference to the function passed into addListener.
   */
  static removeListener(eventType, listener) {
    EventEmitter.removeListener(convertEventEnum(eventType), listener);
  }

  /**
   * Removes all listeners for Urban Airship events.
   *
   * @param eventType The event type. Either EventType.NotificationResponse, EventType.PushReceived,
   * EventType.Register, EventType.Registration, EventType.DeepLink, EventType.NotificationOptInStatus,
   * EventType.InboxUpdated, or EventType.ShowInbox.
   */
  static removeAllListeners(eventType) {
    EventEmitter.removeAllListeners(convertEventEnum(eventType));
  }

  /**
   * Enables or disables autobadging on iOS. Badging is not supported for Android.
   *
   * @param enabled Whether or not to enable autobadging.
   */
  static setAutobadgeEnabled(enabled) {
    if (_reactNative.Platform.OS == 'ios') {
      UrbanAirshipModule.setAutobadgeEnabled(enabled);
    } else {
      console.log("This feature is not supported on this platform.");
    }
  }

  /**
   * Checks to see if autobadging on iOS is enabled. Badging is not supported for Android.
   *
   * @return A promise with the result, either true or false.
   */
  static isAutobadgeEnabled() {
    if (_reactNative.Platform.OS == 'ios') {
      return UrbanAirshipModule.isAutobadgeEnabled();
    } else {
      console.log("This feature is not supported on this platform.");
      return new Promise(resolve => resolve(false));
    }
  }

  /**
   * Sets the badge number for iOS. Badging is not supported for Android.
   *
   * @param badgeNumber The badge number.
   */
  static setBadgeNumber(badgeNumber) {
    if (_reactNative.Platform.OS == 'ios') {
      UrbanAirshipModule.setBadgeNumber(badgeNumber);
    } else {
      console.log("This feature is not supported on this platform.");
    }
  }

  /**
   * Gets the current badge number for iOS. Badging is not supported for Android
   * and this method will always return 0.
   *
   * @return A promise with the result.
   */
  static getBadgeNumber() {
    if (_reactNative.Platform.OS != 'ios') {
      console.log("This feature is not supported on this platform.");
    }
    return UrbanAirshipModule.getBadgeNumber();
  }

  /**
   * Displays the default message center.
   */
  static displayMessageCenter() {
    UrbanAirshipModule.displayMessageCenter();
  }

  /**
   * Dismisses the default message center.
   */
  static dismissMessageCenter() {
    UrbanAirshipModule.dismissMessageCenter();
  }

  /**
   * Displays an inbox message.
   *
   * @param messageId The id of the message to be displayed.
   * @return A promise with the result.
   */
  static displayMessage(messageId) {
    return UrbanAirshipModule.displayMessage(messageId);
  }

  /**
   * Dismisses the currently displayed inbox message.
   */
  static dismissMessage() {
    UrbanAirshipModule.dismissMessage();
  }

  /**
   * Retrieves the current inbox messages.
   *
   * @return A promise with the result.
   */
  static getInboxMessages() {
    return UrbanAirshipModule.getInboxMessages();
  }

  /**
   * Deletes an inbox message.
   *
   * @param messageId The id of the message to be deleted.
   * @return A promise with the result.
   */
  static deleteInboxMessage(messageId) {
    return UrbanAirshipModule.deleteInboxMessage(messageId);
  }

  /**
   * Marks an inbox message as read.
   *
   * @param messageId The id of the message to be marked as read.
   * @return A promise with the result.
   */
  static markInboxMessageRead(messageId) {
    return UrbanAirshipModule.markInboxMessageRead(messageId);
  }

  /**
   * Forces the inbox to refresh. This is normally not needed as the inbox will
   * automatically refresh on foreground or when a push arrives that's associated
   * with a message.
   *
   * @return{Promise.<boolean>} A promise with the result.
   */
  static refreshInbox() {
    return UrbanAirshipModule.refreshInbox();
  }

  /**
   * Sets the default behavior when the message center is launched from a push
   * notification. If set to false the message center must be manually launched.
   *
   * @param enabled true to automatically launch the default message center, false to disable.
   */
  static setAutoLaunchDefaultMessageCenter(enabled) {
    UrbanAirshipModule.setAutoLaunchDefaultMessageCenter(enabled);
  }

  /**
   * Overriding the locale.
   *
   * @param localeIdentifier The locale identifier.
   */
  static setCurrentLocale(localeIdentifier) {
    UrbanAirshipModule.setCurrentLocale(localeIdentifier);
  }

  /**
   * Getting the locale currently used by Airship.
   *
   */
  static getCurrentLocale() {
    return UrbanAirshipModule.getCurrentLocale();
  }

  /**
   * Resets the current locale.
   *
   */
  static clearLocale() {
    UrbanAirshipModule.clearLocale();
  }

  /**
   * Gets all the active notifications for the application.
   * Supported on Android Marshmallow (23)+ and iOS 10+.
   *
   * @return A promise with the result.
   */
  static getActiveNotifications() {
    return UrbanAirshipModule.getActiveNotifications();
  }

  /**
   * Clears all notifications for the application.
   * Supported on Android and iOS 10+. For older iOS devices, you can set
   * the badge number to 0 to clear notifications.
   */
  static clearNotifications() {
    UrbanAirshipModule.clearNotifications();
  }

  /**
   * Clears a specific notification.
   * Supported on Android and iOS 10+.
   *
   * @param identifier The notification identifier. The identifier will be
   * available in the PushReceived event and in the active notification response
   * under the "notificationId" field.
   */
  static clearNotification(identifier) {
    UrbanAirshipModule.clearNotification(identifier);
  }

  /**
   * Sets the in-app message display interval on the default display coordinator.
   *
   * @param seconds The minimum number of seconds between message displays.
   */
  static setInAppAutomationDisplayInterval(seconds) {
    UrbanAirshipModule.setInAppAutomationDisplayInterval(seconds);
  }
  static displayPreferenceCenter(preferenceCenterId) {
    UrbanAirshipModule.displayPreferenceCenter(preferenceCenterId);
  }
  static getPreferenceCenterConfig(preferenceCenterId) {
    return UrbanAirshipModule.getPreferenceCenterConfig(preferenceCenterId);
  }
  static setUseCustomPreferenceCenterUi(useCustomUi, preferenceCenterId) {
    UrbanAirshipModule.setUseCustomPreferenceCenterUi(useCustomUi, preferenceCenterId);
  }
}
exports.UrbanAirship = UrbanAirship;
//# sourceMappingURL=UrbanAirship.js.map