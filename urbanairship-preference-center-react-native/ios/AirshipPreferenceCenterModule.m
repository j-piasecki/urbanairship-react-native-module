#import "AirshipPreferenceCenterModule.h"
#import "UARCTEventEmitter.h"
#import "UARCTStorage.h"

@import AirshipKit;

NSString *const UARCTOpenPreferenceCenterEventName = @"com.urbanairship.open_preference_center";

@implementation AirshipPreferenceCenterModule

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        if (UAirship.isFlying) {
            [self onAirshipReady];
        } else {
            [[NSNotificationCenter defaultCenter] addObserver:self
                                                     selector:@selector(onAirshipReady)
                                                         name:UAirship.airshipReadyNotification
                                                       object:nil];
        }
    }

    return self;
}

RCT_EXPORT_METHOD(open:(NSString *)preferenceCenterId) {
    if (!UAirship.isFlying) {
        return;
    }

    [[UAPreferenceCenter shared] openPreferenceCenter:preferenceCenterId];
}

RCT_EXPORT_METHOD(setUseCustomPreferenceCenterUi:(BOOL)useCustomUi forpreferenceId:(NSString *)preferenceId) {
    [UARCTStorage setAutoLaunch:!useCustomUi preferencesForID:preferenceId];
}

RCT_EXPORT_METHOD(getConfiguration:(NSString *)preferenceCenterId
                  getConfiguration_resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {


    if (!UAirship.isFlying) {
        reject(@"TAKE_OFF_NOT_CALLED", @"Airship not ready, takeOff not called", nil);
        return;
    }

    [[UAPreferenceCenter shared] jsonConfigForPreferenceCenterID:preferenceCenterId completionHandler:^(NSDictionary *config) {
        resolve(config);
    }];
}

- (void)onAirshipReady {
    [UAPreferenceCenter shared].openDelegate = self;
}

#pragma mark -
#pragma mark UAPreferenceCenterOpenDelegate

- (BOOL)openPreferenceCenter:(NSString * _Nonnull)preferenceCenterId {
    if ([UARCTStorage autoLaunchPreferencesForID:preferenceCenterId]) {
        return false;
    }

    [[UARCTEventEmitter shared] sendEventWithName:UARCTOpenPreferenceCenterEventName
                                             body:@{ @"preferenceCenterId": preferenceCenterId }];
    return true;
}

@end
