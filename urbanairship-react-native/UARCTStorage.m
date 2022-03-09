//
//  UARCTStorage.m
//  urbanairship-react-native
//
//  Created by Ryan Lepinski on 3/9/22.
//

#import "UARCTStorage.h"

static NSString *const UARCTPresentationOptionsStorageKey = @"com.urbanairship.presentation_options";
static NSString *const UARCTAutoLaunchMessageCenterKey = @"com.urbanairship.auto_launch_message_center";
static NSString *const UARCTAirshipChatModuleCustomUIKey = @"com.urbanairship.react.chat.custom_ui";
static NSString *const UARCTPreferenceCenterKeyFormat = @"com.urbanairship.react.preference_%@_autolaunch";

@implementation UARCTStorage

+ (void)setForegroundPresentationOptions:(UNNotificationPresentationOptions)foregroundPresentationOptions {
    [self setInteger:foregroundPresentationOptions
              forKey:UARCTPresentationOptionsStorageKey];
}

+ (UNNotificationPresentationOptions)foregroundPresentationOptions {
    return [self integerForKey:UARCTPresentationOptionsStorageKey defaultValue:0];
}

+ (BOOL)isForegroundPresentationOptionsSet {
    return [self isSet:UARCTPresentationOptionsStorageKey];
}

+ (void)setAutoLaunchMessageCenter:(BOOL)autoLaunchMessageCenter {
    [self setBool:autoLaunchMessageCenter forKey:UARCTAutoLaunchMessageCenterKey];
}

+ (BOOL)autoLaunchMessageCenter {
    return [self boolForKey:UARCTAutoLaunchMessageCenterKey defaultValue:YES];
}

+ (BOOL)autoLaunchPreferencesForID:(NSString *)preferenceCenterID {
    NSString *key = [self preferenceCenterKey:preferenceCenterID];
    return [self boolForKey:key defaultValue:YES];
}

+ (void)setAutoLaunch:(BOOL)autoLaunch preferencesForID:(NSString *)preferenceCenterID {
    NSString *key = [self preferenceCenterKey:preferenceCenterID];
    [self setBool:autoLaunch forKey:key];
}


+ (BOOL)autoLaunchChat {
    // Have to negate it
    return ![self boolForKey:UARCTAirshipChatModuleCustomUIKey defaultValue:NO];
}

+ (void)setAutoLaunchChat:(BOOL)autoLaunchChat {
    [self setBool:autoLaunchChat forKey:UARCTAirshipChatModuleCustomUIKey];
}

+(NSString *)preferenceCenterKey:(NSString *)preferenceCenterID {
    return [NSString stringWithFormat:UARCTPreferenceCenterKeyFormat, preferenceCenterID];
}

+ (NSInteger)integerForKey:(NSString *)key defaultValue:(NSInteger)defaultValue {
    if ([[NSUserDefaults standardUserDefaults] objectForKey:key] == nil) {
        return defaultValue;
    }

    return [[NSUserDefaults standardUserDefaults] boolForKey:key];
}

+ (BOOL)boolForKey:(NSString *)key defaultValue:(BOOL)defaultValue {
    if ([[NSUserDefaults standardUserDefaults] objectForKey:key] == nil) {
        return defaultValue;
    }

    return [[NSUserDefaults standardUserDefaults] boolForKey:key];
}

+ (void)setBool:(BOOL)value forKey:(NSString *)key {
    [[NSUserDefaults standardUserDefaults] setBool:value forKey:key];
}

+ (void)setInteger:(NSInteger)value forKey:(NSString *)key {
    [[NSUserDefaults standardUserDefaults] setInteger:value forKey:key];
}

+ (BOOL)isSet:(NSString *)key {
    return [[NSUserDefaults standardUserDefaults] objectForKey:key] != nil;
}

@end
