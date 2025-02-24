/* Copyright Urban Airship and Contributors */

#import "UrbanAirshipReactModule.h"
#import "UARCTEventEmitter.h"
#import "UARCTAutopilot.h"
#import "UARCTUtils.h"
#import "UARCTStorage.h"
#import "UARCTAirshipListener.h"

#if __has_include("AirshipLib.h")
#import "UAInAppMessageHTMLAdapter.h"
#import "UAMessageCenterResources.h"
#import "UAInboxMessage.h"
#else
@import AirshipKit;
#endif

@interface UrbanAirshipReactModule()
@property(nonatomic, strong) UARCTAirshipListener *airshipListener;
@end

@implementation UrbanAirshipReactModule

NSString *const UARCTStatusMessageNotFound = @"STATUS_MESSAGE_NOT_FOUND";
NSString *const UARCTStatusInboxRefreshFailed = @"STATUS_INBOX_REFRESH_FAILED";
NSString *const UARCTErrorDescriptionMessageNotFound = @"Message not found for provided id.";
NSString *const UARCTErrorDescriptionInboxRefreshFailed = @"Failed to refresh inbox.";

int const UARCTErrorCodeMessageNotFound = 0;
int const UARCTErrorCodeInboxRefreshFailed = 1;


NSString * const UARCTErrorDomain = @"com.urbanairship.react";
NSString *const UARCTStatusUnavailable = @"UNAVAILABLE";
NSString *const UARCTStatusInvalidFeature = @"INVALID_FEATURE";
NSString *const UARCTErrorDescriptionInvalidFeature = @"Invalid feature, cancelling the action.";
int const UARCTErrorCodeInvalidFeature = 2;

#pragma mark -
#pragma mark Module setup

RCT_EXPORT_MODULE();

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

- (void)setBridge:(RCTBridge *)bridge {
    [UARCTEventEmitter shared].bridge = bridge;
    [self attemptTakeOff];
}

- (RCTBridge *)bridge {
    return [UARCTEventEmitter shared].bridge;
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

- (void)attemptTakeOff {
    [UARCTAutopilot takeOffWithLaunchOptions:self.bridge.launchOptions];
}

#pragma mark -
#pragma mark Module methods

RCT_EXPORT_METHOD(addListener:(NSString *)eventName) {
}

RCT_EXPORT_METHOD(removeListeners:(NSInteger)count) {
}

RCT_EXPORT_METHOD(onAirshipListenerAdded:(NSString *)eventName) {
    [[UARCTEventEmitter shared] onAirshipListenerAddedForType:eventName];
}

RCT_REMAP_METHOD(takeOff,
                 config:(NSDictionary *)config
                 takeOff_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    UARCTStorage.airshipConfig = config;
    [self attemptTakeOff];
    resolve(@(UAirship.isFlying));
}

RCT_REMAP_METHOD(isFlying,
                 isFlying_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    resolve(@(UAirship.isFlying));
}

RCT_REMAP_METHOD(takePendingEvents,
                 type:(NSString *)type
                 takePendingEvents_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {

    resolve([[UARCTEventEmitter shared] takePendingEventsWithType:type]);
}

RCT_EXPORT_METHOD(setUserNotificationsEnabled:(BOOL)enabled) {
    if (![self ensureAirshipReady]) {
        return;
    }

    [UAirship push].userPushNotificationsEnabled = enabled;
}

RCT_EXPORT_METHOD(enableChannelCreation) {
    if (![self ensureAirshipReady]) {
        return;
    }

    [[UAirship channel] enableChannelCreation];
}

RCT_REMAP_METHOD(setEnabledFeatures,
                 features:(NSArray *) features
                 setEnabledFeatures_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {

    if (![self ensureAirshipReady:reject]) {
        return;
    }


    if ([UARCTUtils isValidFeatureArray:features]) {
        [UAirship shared].privacyManager.enabledFeatures = [UARCTUtils stringArrayToFeatures:features];
        resolve(@(YES));
    } else {
        NSString *code = [NSString stringWithFormat:UARCTStatusInvalidFeature];
        NSString *errorMessage = [NSString stringWithFormat:UARCTErrorDescriptionInvalidFeature];
        NSError *error =  [NSError errorWithDomain:UARCTErrorDomain
                                              code:UARCTErrorCodeInvalidFeature
                                          userInfo:@{NSLocalizedDescriptionKey:errorMessage}];
        reject(code, errorMessage, error);
    }
}

RCT_REMAP_METHOD(getEnabledFeatures,
                 getEnabledFeatures_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    if (![self ensureAirshipReady:reject]) {
        return;
    }

    resolve([UARCTUtils featureToStringArray:[UAirship shared].privacyManager.enabledFeatures]);
}

RCT_REMAP_METHOD(enableFeature,
                 features:(NSArray *) features
                 enableFeature_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    if (![self ensureAirshipReady:reject]) {
        return;
    }

    if ([UARCTUtils isValidFeatureArray:features]) {
        [[UAirship shared].privacyManager enableFeatures:[UARCTUtils stringArrayToFeatures:features]];
        resolve(@(YES));
    } else {
        NSString *code = [NSString stringWithFormat:UARCTStatusInvalidFeature];
        NSString *errorMessage = [NSString stringWithFormat:UARCTErrorDescriptionInvalidFeature];
        NSError *error =  [NSError errorWithDomain:UARCTErrorDomain
                                              code:UARCTErrorCodeInvalidFeature
                                          userInfo:@{NSLocalizedDescriptionKey:errorMessage}];
        reject(code, errorMessage, error);
    }
}

RCT_REMAP_METHOD(disableFeature,
                 features:(NSArray *) features
                 disableFeature_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    if (![self ensureAirshipReady:reject]) {
        return;
    }

    if ([UARCTUtils isValidFeatureArray:features]) {
        [[UAirship shared].privacyManager disableFeatures:[UARCTUtils stringArrayToFeatures:features]];
        resolve(@(YES));
    } else {
        NSString *code = [NSString stringWithFormat:UARCTStatusInvalidFeature];
        NSString *errorMessage = [NSString stringWithFormat:UARCTErrorDescriptionInvalidFeature];
        NSError *error =  [NSError errorWithDomain:UARCTErrorDomain
                                              code:UARCTErrorCodeInvalidFeature
                                          userInfo:@{NSLocalizedDescriptionKey:errorMessage}];
        reject(code, errorMessage, error);
    }
}

RCT_REMAP_METHOD(isFeatureEnabled,
                 features:(NSArray *)features
                 isFeatureEnabled_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {

    if (![self ensureAirshipReady:reject]) {
        return;
    }

    if ([UARCTUtils isValidFeatureArray:features]) {
        resolve(@([[UAirship shared].privacyManager isEnabled:[UARCTUtils stringArrayToFeatures:features]]));
    } else {
        NSString *code = [NSString stringWithFormat:UARCTStatusInvalidFeature];
        NSString *errorMessage = [NSString stringWithFormat:UARCTErrorDescriptionInvalidFeature];
        NSError *error =  [NSError errorWithDomain:UARCTErrorDomain
                                              code:UARCTErrorCodeInvalidFeature
                                          userInfo:@{NSLocalizedDescriptionKey:errorMessage}];
        reject(code, errorMessage, error);
    }
}

RCT_REMAP_METHOD(isUserNotificationsEnabled,
                 isUserNotificationsEnabled_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    if (![self ensureAirshipReady:reject]) {
        return;
    }

    resolve(@([UAirship push].userPushNotificationsEnabled));
}

RCT_REMAP_METHOD(isUserNotificationsOptedIn,
                 isUserNotificationsOptedIn_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    if (![self ensureAirshipReady:reject]) {
        return;
    }

    BOOL optedIn = YES;
    if (![UAirship push].deviceToken) {
        UA_LTRACE(@"Opted out: missing device token");
        optedIn = NO;
    }

    if (![UAirship push].userPushNotificationsEnabled) {
        UA_LTRACE(@"Opted out: user push notifications disabled");
        optedIn = NO;
    }

    if (![UAirship push].authorizedNotificationSettings) {
        UA_LTRACE(@"Opted out: no authorized notification settings");
        optedIn = NO;
    }

    if (![[UAirship shared].privacyManager isEnabled:UAFeaturesPush]) {
        UA_LTRACE(@"Opted out: push is disabled");
        optedIn = NO;
    }
    resolve(@(optedIn));
}

RCT_REMAP_METHOD(isSystemNotificationsEnabledForApp,
                 isSystemNotificationsEnabledForApp_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    if (![self ensureAirshipReady:reject]) {
        return;
    }

    BOOL optedIn = [UAirship push].authorizedNotificationSettings != 0;
    resolve(@(optedIn));
}

RCT_REMAP_METHOD(enableUserPushNotifications,
                 enableUserPushNotifications_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    if (![self ensureAirshipReady:reject]) {
        return;
    }

    [[UAirship push] enableUserPushNotifications:^(BOOL success) {
        resolve(@(success));
    }];
}

RCT_EXPORT_METHOD(setNamedUser:(NSString *)namedUser) {
    if (![self ensureAirshipReady]) {
        return;
    }

    namedUser = [namedUser stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];
    if (namedUser.length) {
        [UAirship.contact identify:namedUser];
    } else {
        [UAirship.contact reset];
    }
}

RCT_REMAP_METHOD(getNamedUser,
                 getNamedUser_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    if (![self ensureAirshipReady:reject]) {
        return;
    }

    resolve(UAirship.contact.namedUserID);
}

RCT_EXPORT_METHOD(addTag:(NSString *)tag) {
    if (![self ensureAirshipReady]) {
        return;
    }
    if (tag) {
        [UAirship.channel editTags:^(UATagEditor *editor) {
            [editor addTag:tag];
        }];
    }
}

RCT_EXPORT_METHOD(removeTag:(NSString *)tag) {
    if (![self ensureAirshipReady]) {
        return;
    }

    if (tag) {
        [UAirship.channel editTags:^(UATagEditor *editor) {
            [editor removeTag:tag];
        }];
    }
}

RCT_REMAP_METHOD(getTags,
                 getTags_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    if (![self ensureAirshipReady:reject]) {
        return;
    }
    resolve(UAirship.channel.tags ?: [NSArray array]);
}

RCT_REMAP_METHOD(getSubscriptionLists,
                 subscriptionTypes:(NSArray *)subscriptionTypes
                 getSubscriptionLists_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {

    if (![self ensureAirshipReady:reject]) {
        return;
    }

    NSSet *typedSet = [NSSet setWithArray:subscriptionTypes];
    if (!typedSet.count) {
        NSError *error = [UAirshipErrors error:@"Failed to fetch subscription lists, no types."];
        reject(error.description, error.description, error);
        return;
    }
    
    dispatch_group_t group = dispatch_group_create();
    NSMutableDictionary *result = [NSMutableDictionary dictionary];
    __block NSError *resultError;
    
    dispatch_group_enter(group);
    
    if ([typedSet containsObject:@"channel"]) {
        dispatch_group_enter(group);
        
        [UAirship.channel fetchSubscriptionListsWithCompletionHandler:^(NSArray<NSString *> * lists, NSError *error) {
            @synchronized (result) {
                result[@"channel"] = lists ?: @[];
                if (!resultError) {
                    resultError = error;
                }
            }
            dispatch_group_leave(group);
        }];
    }
    
    if ([typedSet containsObject:@"contact"]) {
        dispatch_group_enter(group);
        
        [UAirship.contact fetchSubscriptionListsWithCompletionHandler:^(NSDictionary<NSString *,UAChannelScopes *> * lists, NSError *error) {
            
            @synchronized (result) {
                NSMutableDictionary *converted = [NSMutableDictionary dictionary];
                for (NSString* identifier in lists.allKeys) {
                    UAChannelScopes *scopes = lists[identifier];
                    NSMutableArray *scopesArray = [NSMutableArray array];
                    for (id scope in scopes.values) {
                        UAChannelScope channelScope = (UAChannelScope)[scope intValue];
                        [scopesArray addObject:[self getScopeString:channelScope]];
                    }
                    [converted setValue:scopesArray forKey:identifier];
                }

                result[@"contact"] = converted;

                if (!resultError) {
                    resultError = error;
                }
            }
            dispatch_group_leave(group);
        }];
    
    }
    
    dispatch_group_leave(group);

    dispatch_group_notify(group, dispatch_get_main_queue(), ^{
        if (resultError) {
            reject(resultError.description, resultError.description, resultError);
        } else {
            resolve(result);
        }
    });
}

- (NSString *)getScopeString:(UAChannelScope )scope {
    switch (scope) {
        case UAChannelScopeSms:
            return @"sms";
        case UAChannelScopeEmail:
            return @"email";
        case UAChannelScopeApp:
            return @"app";
        case UAChannelScopeWeb:
            return @"web";
    }
}

RCT_EXPORT_METHOD(setAnalyticsEnabled:(BOOL)enabled) {
    if (![self ensureAirshipReady]) {
        return;
    }

    if (enabled) {
        [[UAirship shared].privacyManager enableFeatures:UAFeaturesAnalytics];
    } else {
        [[UAirship shared].privacyManager disableFeatures:UAFeaturesAnalytics];
    }
}

RCT_REMAP_METHOD(isAnalyticsEnabled,
                 isAnalyticsEnabled_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    if (![self ensureAirshipReady:reject]) {
        return;
    }

    resolve(@([[UAirship shared].privacyManager isEnabled:UAFeaturesAnalytics]));
}

RCT_EXPORT_METHOD(trackScreen:(NSString *)screen) {
    if (![self ensureAirshipReady]) {
        return;
    }
    [UAirship.analytics trackScreen:screen];
}

RCT_REMAP_METHOD(getChannelId,
                 getChannelId_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    if (![self ensureAirshipReady:reject]) {
        return;
    }

    resolve(UAirship.channel.identifier);
}


RCT_REMAP_METHOD(getRegistrationToken,
                 getRegistrationToken_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    if (![self ensureAirshipReady:reject]) {
        return;
    }

    resolve(UAirship.push.deviceToken);
}

RCT_REMAP_METHOD(associateIdentifier,
                 key:(NSString *)key
                 identifier:(NSString *)identifier) {
    if (![self ensureAirshipReady]) {
        return;
    }

    UAAssociatedIdentifiers *identifiers = [UAirship.analytics currentAssociatedDeviceIdentifiers];
    [identifiers setIdentifier:identifier forKey:key];
    [UAirship.analytics associateDeviceIdentifiers:identifiers];
}

RCT_REMAP_METHOD(runAction,
                 name:(NSString *)name
                 value:(id)value
                 runAction_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    if (![self ensureAirshipReady:reject]) {
        return;
    }

    [UAActionRunner runActionWithName:name
                                value:value
                            situation:UASituationManualInvocation
                    completionHandler:^(UAActionResult *actionResult) {

                        NSString *resultString;
                        NSString *code;
                        NSString *errorMessage;
                        NSError *error;

                        switch (actionResult.status) {
                            case UAActionStatusCompleted:
                            {
                                if (actionResult.value) {
                                    //if the action completed with a result value, serialize into JSON
                                    //accepting fragments so we can write lower level JSON values
                                    resultString = [UAJSONUtils stringWithObject:actionResult.value options:NSJSONWritingFragmentsAllowed error:&error];
                                    // If there was an error serializing, fall back to a string description.
                                    if (error) {
                                        error = error;
                                        UA_LDEBUG(@"Unable to serialize result value %@, falling back to string description", actionResult.value);
                                        // JSONify the result string
                                        resultString = [UAJSONUtils stringWithObject:[actionResult.value description] options:NSJSONWritingFragmentsAllowed error:&error];
                                    }
                                }
                                //in the case where there is no result value, pass null
                                resultString = resultString ?: @"null";
                                break;
                            }
                            case UAActionStatusActionNotFound:
                                errorMessage = [NSString stringWithFormat:@"No action found with name %@, skipping action.", name];
                                code = @"STATUS_ACTION_NOT_FOUND";
                                break;
                            case UAActionStatusError:
                                errorMessage = actionResult.error.localizedDescription;
                                code = @"STATUS_EXECUTION_ERROR";
                                break;
                            case UAActionStatusArgumentsRejected:
                                code = @"STATUS_REJECTED_ARGUMENTS";
                                errorMessage = [NSString stringWithFormat:@"Action %@ rejected arguments.", name];
                                break;
                        }

                        if (actionResult.status == UAActionStatusCompleted) {
                            NSMutableDictionary *result = [NSMutableDictionary dictionary];
                            [result setValue:actionResult.value forKey:@"value"];
                            resolve(actionResult);
                        }

                        if (errorMessage) {
                            reject(code, errorMessage, error);
                        }

                    }];
}

RCT_EXPORT_METHOD(editContactTagGroups:(NSArray *)operations) {
    if (![self ensureAirshipReady]) {
        return;
    }

    [UAirship.contact editTagGroups:^(UATagGroupsEditor * editor) {
        [self applyTagGroupOperations:operations editor:editor];
    }];
}

RCT_EXPORT_METHOD(editChannelTagGroups:(NSArray *)operations) {
    if (![self ensureAirshipReady]) {
        return;
    }

    [UAirship.channel editTagGroups:^(UATagGroupsEditor * editor) {
        [self applyTagGroupOperations:operations editor:editor];
    }];
}

RCT_EXPORT_METHOD(editChannelAttributes:(NSArray *)operations) {
    if (![self ensureAirshipReady]) {
        return;
    }

    [UAirship.channel editAttributes:^(UAAttributesEditor *editor) {
        [self applyAttributeOperations:operations editor:editor];
    }];
}

RCT_EXPORT_METHOD(editContactAttributes:(NSArray *)operations) {
    if (![self ensureAirshipReady]) {
        return;
    }

    [UAirship.contact editAttributes:^(UAAttributesEditor *editor) {
        [self applyAttributeOperations:operations editor:editor];
    }];
}

RCT_EXPORT_METHOD(editChannelSubscriptionLists:(NSArray *)subscriptionListUpdates) {
    if (![self ensureAirshipReady]) {
        return;
    }

    UASubscriptionListEditor* subscriptionListEditor = [[UAirship channel] editSubscriptionLists];
    for (NSDictionary *subscriptionListUpdate in subscriptionListUpdates) {
        NSString* listId = subscriptionListUpdate[@"listId"];
        NSString* type = subscriptionListUpdate[@"type"];
        if (listId && type) {
            if ([type isEqualToString:@"subscribe"]) {
                [subscriptionListEditor subscribe:listId];
            } else if ([type isEqualToString:@"unsubscribe"]) {
                [subscriptionListEditor unsubscribe:listId];
            }
        }
    }
    [subscriptionListEditor apply];
}

RCT_EXPORT_METHOD(editContactSubscriptionLists:(NSArray *)subscriptionListUpdates) {
    if (![self ensureAirshipReady]) {
        return;
    }

    UAScopedSubscriptionListEditor* subscriptionListEditor = [[UAirship contact] editSubscriptionLists];

    for (NSDictionary *subscriptionListUpdate in subscriptionListUpdates) {
        NSString *listId = subscriptionListUpdate[@"listId"];
        NSString *type = subscriptionListUpdate[@"type"];
        NSString *scopeString = [subscriptionListUpdate[@"scope"] lowercaseString];

        if (!listId || !type) {
            continue;
        }

        UAChannelScope scope;
        if ([scopeString isEqualToString:@"sms"]) {
            scope = UAChannelScopeSms;
        } else if ([scopeString isEqualToString:@"email"]) {
            scope = UAChannelScopeEmail;
        } else if ([scopeString isEqualToString:@"app"]) {
            scope = UAChannelScopeApp;
        } else if ([scopeString isEqualToString:@"web"]) {
            scope = UAChannelScopeWeb;
        } else {
            continue;
        }

        if ([type isEqualToString:@"subscribe"]) {
            [subscriptionListEditor subscribe:listId scope:scope];
        } else if ([type isEqualToString:@"unsubscribe"]) {
            [subscriptionListEditor unsubscribe:listId scope:scope];
        }
    }

    [subscriptionListEditor apply];
}

RCT_EXPORT_METHOD(setNotificationOptions:(NSArray *)options) {
    if (![self ensureAirshipReady]) {
        return;
    }

    UANotificationOptions notificationOptions = [UARCTUtils optionsFromOptionsArray:options];
    UA_LDEBUG(@"Notification options set: %lu from dictionary: %@", (unsigned long)notificationOptions, options);
    UAirship.push.notificationOptions = notificationOptions;
    [UAirship.push updateRegistration];
}

RCT_EXPORT_METHOD(setForegroundPresentationOptions:(NSArray *)options) {
    if (![self ensureAirshipReady]) {
        return;
    }

    UNNotificationPresentationOptions presentationOptions = UNNotificationPresentationOptionNone;

    if ([options containsObject:@"alert"]) {
        presentationOptions = presentationOptions | UNNotificationPresentationOptionAlert;
    }

    if ([options containsObject:@"badge"]) {
        presentationOptions = presentationOptions | UNNotificationPresentationOptionBadge;
    }

    if ([options containsObject:@"sound"]) {
        presentationOptions = presentationOptions | UNNotificationPresentationOptionSound;
    }
    
    UA_LDEBUG(@"Foreground presentation options set: %lu from dictionary: %@", (unsigned long)presentationOptions, options);

    [UAirship push].defaultPresentationOptions = presentationOptions;
    UARCTStorage.foregroundPresentationOptions = presentationOptions;
}


RCT_REMAP_METHOD(getNotificationStatus,
                 getNotificationStatus_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    if (![self ensureAirshipReady:reject]) {
        return;
    }
    
    UAPush *push = UAirship.push;
    BOOL isSystemEnabled = push.authorizedNotificationSettings != 0;
    id result = @{
        @"airshipOptIn": @(push.isPushNotificationsOptedIn),
        @"airshipEnabled": @(push.userPushNotificationsEnabled),
        @"systemEnabled": @(isSystemEnabled),
        @"ios": @{
            @"authorizedSettings": [UARCTUtils authorizedSettingsArray:push.authorizedNotificationSettings],
            @"authorizedStatus": [UARCTUtils authorizedStatusString:push.authorizationStatus]
        }
    };
    
    resolve(result);
}


RCT_EXPORT_METHOD(setAutobadgeEnabled:(BOOL)enabled) {
    if (![self ensureAirshipReady]) {
        return;
    }

    [UAirship push].autobadgeEnabled = enabled;
}

RCT_REMAP_METHOD(isAutobadgeEnabled,
                 isAutobadgeEnabled_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {

    if (![self ensureAirshipReady:reject]) {
        return;
    }

    resolve(@([UAirship push].autobadgeEnabled));
}

RCT_EXPORT_METHOD(setBadgeNumber:(NSInteger)badgeNumber) {
    if (![self ensureAirshipReady]) {
        return;
    }
    [[UAirship push] setBadgeNumber:badgeNumber];
}

RCT_REMAP_METHOD(getBadgeNumber,
                 getBadgeNumber_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    if (![self ensureAirshipReady:reject]) {
        return;
    }

    resolve(@([UIApplication sharedApplication].applicationIconBadgeNumber));
}

RCT_EXPORT_METHOD(displayMessageCenter) {
    if (![self ensureAirshipReady]) {
        return;
    }

    [[UAMessageCenter shared] display];
}

RCT_EXPORT_METHOD(dismissMessageCenter) {
    if (![self ensureAirshipReady]) {
        return;
    }

    [[UAMessageCenter shared] dismiss];
}

RCT_REMAP_METHOD(displayMessage,
                 messageId:(NSString *)messageId
                 displayMessage_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {

    if (![self ensureAirshipReady:reject]) {
        return;
    }

    [[UAMessageCenter shared] displayMessageForID:messageId];
    resolve(@YES);
}

RCT_REMAP_METHOD(dismissMessage,
                 dismissMessage_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {

    if (![self ensureAirshipReady:reject]) {
        return;
    }

    [[UAMessageCenter shared] dismiss:YES];
    resolve(@YES);
}

RCT_REMAP_METHOD(getInboxMessages,
                 getInboxMessages_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {

    if (![self ensureAirshipReady:reject]) {
        return;
    }
    
    NSMutableArray *messages = [NSMutableArray array];
    for (UAInboxMessage *message in [UAMessageCenter shared].messageList.messages) {

        NSDictionary *icons = [message.rawMessageObject objectForKey:@"icons"];
        NSString *iconUrl = [icons objectForKey:@"list_icon"];
        NSNumber *sentDate = @([message.messageSent timeIntervalSince1970] * 1000);

        NSMutableDictionary *messageInfo = [NSMutableDictionary dictionary];
        [messageInfo setValue:message.title forKey:@"title"];
        [messageInfo setValue:message.messageID forKey:@"id"];
        [messageInfo setValue:sentDate forKey:@"sentDate"];
        [messageInfo setValue:iconUrl forKey:@"listIconUrl"];
        [messageInfo setValue:message.unread ? @NO : @YES  forKey:@"isRead"];
        [messageInfo setValue:message.extra forKey:@"extras"];
        [messageInfo setObject:message.deleted ? @YES : @NO forKey:@"isDeleted"];

        [messages addObject:messageInfo];
    }

    resolve(messages);
}

RCT_REMAP_METHOD(deleteInboxMessage,
                 messageId:(NSString *)messageId
                 deleteMessage_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {

    if (![self ensureAirshipReady:reject]) {
        return;
    }

    UAInboxMessage *message = [[UAMessageCenter shared].messageList messageForID:messageId];

    if (!message) {
        NSError *error =  [NSError errorWithDomain:UARCTErrorDomain
                                              code:UARCTErrorCodeMessageNotFound
                                          userInfo:@{NSLocalizedDescriptionKey:UARCTErrorDescriptionMessageNotFound}];

        reject(UARCTStatusMessageNotFound, UARCTErrorDescriptionMessageNotFound, error);
    } else {
        [[UAMessageCenter shared].messageList markMessagesDeleted:@[message] completionHandler:^(){
            resolve(@YES);
        }];
    }
}

RCT_REMAP_METHOD(markInboxMessageRead,
                 messageId:(NSString *)messageId
                 markMessageRead_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {

    if (![self ensureAirshipReady:reject]) {
        return;
    }

    UAInboxMessage *message = [[UAMessageCenter shared].messageList messageForID:messageId];

    if (!message) {
        NSError *error =  [NSError errorWithDomain:UARCTErrorDomain
                                              code:UARCTErrorCodeMessageNotFound
                                          userInfo:@{NSLocalizedDescriptionKey:UARCTErrorDescriptionMessageNotFound}];

        reject(UARCTStatusMessageNotFound, UARCTErrorDescriptionMessageNotFound, error);
    } else {
        [[UAMessageCenter shared].messageList markMessagesRead:@[message] completionHandler:^(){
            resolve(@YES);
        }];
    }
}

RCT_REMAP_METHOD(refreshInbox,
                 refreshInbox_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {

    if (![self ensureAirshipReady:reject]) {
        return;
    }

    [[UAMessageCenter shared].messageList retrieveMessageListWithSuccessBlock:^(){
        resolve(@YES);
    } withFailureBlock:^(){
        NSError *error =  [NSError errorWithDomain:UARCTErrorDomain
                                              code:UARCTErrorCodeInboxRefreshFailed
                                          userInfo:@{NSLocalizedDescriptionKey:UARCTErrorDescriptionInboxRefreshFailed}];
        reject(UARCTStatusInboxRefreshFailed, UARCTErrorDescriptionInboxRefreshFailed, error);
    }];
}

RCT_EXPORT_METHOD(setAutoLaunchDefaultMessageCenter:(BOOL)enabled) {
    if (![self ensureAirshipReady]) {
        return;
    }
    UARCTStorage.autoLaunchMessageCenter = enabled;
}

RCT_EXPORT_METHOD(setCurrentLocale:(NSString *)localeIdentifier) {
    if (![self ensureAirshipReady]) {
        return;
    }
    [UAirship.shared.localeManager setCurrentLocale:[NSLocale localeWithLocaleIdentifier:localeIdentifier]];
}

RCT_REMAP_METHOD(getCurrentLocale,
                 getCurrentLocale_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    if (![self ensureAirshipReady:reject]) {
        return;
    }

    NSLocale *airshipLocale = [[UAirship shared].localeManager currentLocale];
    resolve(airshipLocale.localeIdentifier);
}

RCT_EXPORT_METHOD(clearLocale) {
    if (![self ensureAirshipReady]) {
        return;
    }

    [[UAirship shared].localeManager clearLocale];
}

RCT_EXPORT_METHOD(clearNotifications) {
    [[UNUserNotificationCenter currentNotificationCenter] removeAllDeliveredNotifications];
}

RCT_EXPORT_METHOD(clearNotification:(NSString *)identifier) {
    if (identifier) {
        [[UNUserNotificationCenter currentNotificationCenter] removeDeliveredNotificationsWithIdentifiers:@[identifier]];
    }
}

RCT_EXPORT_METHOD(setInAppAutomationDisplayInterval:(NSInteger)seconds) {
    UAInAppAutomation.shared.inAppMessageManager.displayInterval = seconds;
}

RCT_REMAP_METHOD(getUnreadMessagesCount,
                 getUnreadMessagesCount_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    if (![self ensureAirshipReady:reject]) {
        return;
    }
    
    resolve(@([UAMessageCenter shared].messageList.unreadCount));
}

RCT_REMAP_METHOD(getActiveNotifications,
                 getNotifications_resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    [[UNUserNotificationCenter currentNotificationCenter] getDeliveredNotificationsWithCompletionHandler:^(NSArray<UNNotification *> * _Nonnull notifications) {
        NSMutableArray *result = [NSMutableArray array];
        for(UNNotification *unnotification in notifications) {
            [result addObject:[UARCTUtils eventBodyForNotificationContent:unnotification.request.content.userInfo notificationIdentifier:unnotification.request.identifier]];
        }

        resolve(result);
    }];
}

#pragma mark -
#pragma mark Helper methods

- (void)applyTagGroupOperations:(NSArray *)operations editor:(UATagGroupsEditor *)editor {
    for (NSDictionary *operation in operations) {
        NSArray *tags = operation[@"tags"] ?: @[];
        NSString *group =  operation[@"group"];
        NSString *operationType =  operation[@"operationType"];

        if ([operationType isEqualToString:@"add"]) {
            [editor addTags:tags group:group];
        } else if ([operationType isEqualToString:@"remove"]) {
            [editor removeTags:tags group:group];
        } else if ([operationType isEqualToString:@"set"]) {
            [editor setTags:tags group:group];
        }
    }
}
- (void)applyAttributeOperations:(NSArray *)operations editor:(UAAttributesEditor *)editor {
    for (NSDictionary *operation in operations) {
        NSString *action = operation[@"action"];
        NSString *name = operation[@"key"];
        id value = operation[@"value"];

        if ([action isEqualToString:@"set"]) {
            NSString *valueType = operation[@"type"];
                if ([valueType isEqualToString:@"string"]) {
                    [editor setString:value attribute:name];
                } else if ([valueType isEqualToString:@"number"]) {
                    [editor setNumber:value attribute:name];
                } else if ([valueType isEqualToString:@"date"]) {
                    // JavaScript's date type doesn't pass through the JS to native bridge. Dates are instead serialized as milliseconds since epoch.
                    NSDate *date = [NSDate dateWithTimeIntervalSince1970:[(NSNumber *)value doubleValue] / 1000.0];
                    [editor setDate:date attribute:name];
                } else {
                    UA_LWARN(@"Unknown channel attribute type: %@", valueType);
                }
        } else if ([action isEqualToString:@"remove"]) {
            [editor removeAttribute:name];
        }
    }
    
}

- (BOOL)ensureAirshipReady {
    return [self ensureAirshipReady:nil];
}

- (BOOL)ensureAirshipReady:(RCTPromiseRejectBlock)reject {
    if (UAirship.isFlying) {
        return YES;
    }

    if (reject) {
        reject(@"TAKE_OFF_NOT_CALLED", @"Airship not ready, takeOff not called", nil);
    }
    return NO;
}

@end
