/* Copyright Airship and Contributors */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UAEventEmitter = exports.AirshipEventBridge = void 0;

var _reactNative = require("react-native");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @hidden
 */
class AirshipEventBridge {
  constructor(dispatchEventsCallback) {
    _defineProperty(this, "dispatchEventsCallback", void 0);

    this.dispatchEventsCallback = dispatchEventsCallback;
  }

}

exports.AirshipEventBridge = AirshipEventBridge;

class DefaultAirshipEventBridge extends AirshipEventBridge {
  constructor(dispatchEventsCallback) {
    super(dispatchEventsCallback);

    _defineProperty(this, "nativeModule", _reactNative.NativeModules.UrbanAirshipReactModule);

    _defineProperty(this, "eventEmitter", new _reactNative.NativeEventEmitter(this.nativeModule));

    if (_reactNative.Platform.OS === 'android') {
      _reactNative.AppRegistry.registerHeadlessTask('AirshipAndroidBackgroundEventTask', () => {
        return () => dispatchEventsCallback(this.nativeModule.takePendingBackgroundEvents);
      });

      this.eventEmitter.addListener("com.urbanairship.onPendingForegroundEvent", async () => {
        return dispatchEventsCallback(this.nativeModule.takePendingForegroundEvents);
      });
    } else if (_reactNative.Platform.OS === 'ios') {
      this.eventEmitter.addListener("com.urbanairship.onPendingEvent", async () => {
        return dispatchEventsCallback(this.nativeModule.takePendingEvents);
      });
    }
  }

  notifyAirshipListenerAdded(eventType) {
    this.nativeModule.onAirshipListenerAdded(eventType);
  }

}
/**
 * SDK event emitter.
 *
 * @hidden
 */


class UAEventEmitter {
  constructor(airshipEventBridgeFactory) {
    _defineProperty(this, "airshipEventBridge", void 0);

    _defineProperty(this, "listeners", void 0);

    this.listeners = new Map();
    this.airshipEventBridge = airshipEventBridgeFactory ? airshipEventBridgeFactory(this.dispatchEvents.bind(this)) : new DefaultAirshipEventBridge(this.dispatchEvents.bind(this));
  }

  removeListener(eventType, listener) {
    var typedListeners = this.listeners.get(eventType);

    if (typedListeners) {
      typedListeners = typedListeners.filter(obj => obj !== listener);
      this.listeners.set(eventType, typedListeners);
    }
  }

  addListener(eventType, listener) {
    var _this$listeners$get;

    if (!this.listeners.get(eventType)) {
      this.listeners.set(eventType, new Array());
    }

    (_this$listeners$get = this.listeners.get(eventType)) === null || _this$listeners$get === void 0 ? void 0 : _this$listeners$get.push(listener);
    this.airshipEventBridge.notifyAirshipListenerAdded(eventType);
  }

  removeAllListeners(eventType) {
    this.listeners.set(eventType, new Array());
  }

  async dispatchEvents(source) {
    let actions = Array.from(this.listeners.keys()).map(async key => {
      let typedListeners = this.listeners.get(key);

      if (typedListeners == null) {
        return Promise.resolve();
      }

      let events = await source(key);
      return Promise.all(typedListeners.map(async listener => {
        for (const event of events) {
          await listener(event);
        }
      }));
    });
    return Promise.all(actions);
  }

}

exports.UAEventEmitter = UAEventEmitter;
//# sourceMappingURL=UAEventEmitter.js.map