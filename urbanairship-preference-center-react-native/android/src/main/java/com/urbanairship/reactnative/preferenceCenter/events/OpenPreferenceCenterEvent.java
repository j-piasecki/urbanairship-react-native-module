package com.urbanairship.reactnative.preferenceCenter.events;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.urbanairship.reactnative.Event;

public class OpenPreferenceCenterEvent implements Event {

    private static final String OPEN_PREFERENCE_CENTER_EVENT = "com.urbanairship.open_preference_center";
    private final String preferenceCenterId;

    public OpenPreferenceCenterEvent(String preferenceCenterId) {
        this.preferenceCenterId = preferenceCenterId;
    }

    @NonNull
    @Override
    public String getName() {
        return OPEN_PREFERENCE_CENTER_EVENT;
    }

    @NonNull
    @Override
    public ReadableMap getBody() {
        WritableMap map = Arguments.createMap();

        if (preferenceCenterId != null) {
            map.putString("preferenceCenterId", preferenceCenterId);
        }
        return map;
    }

    @Override
    public boolean isForeground() {
        return false;
    }
}
