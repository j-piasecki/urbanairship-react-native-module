/* Copyright Airship and Contributors */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CustomEvent = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Custom event
 */
class CustomEvent {
  /**
   * Custom event constructor.
   *
   * @param name The event name.
   * @param value The event value.
   */
  constructor(name, value) {
    _defineProperty(this, "_name", void 0);

    _defineProperty(this, "_value", void 0);

    _defineProperty(this, "_properties", void 0);

    _defineProperty(this, "_transactionId", void 0);

    this._name = name;
    this._value = value;
    this._properties = {};
  }
  /**
   * Gets the event's transaction ID.
  */


  get transactionId() {
    return this._transactionId;
  }
  /**
   * Sets the event's transaction ID.
   */


  set transactionId(value) {
    this._transactionId = value;
  }
  /**
   * Adds a property to the custom event.
   *
   * @param name The property name.
   * @param value The property value.
   */


  addProperty(name, value) {
    this._properties[name] = value;
  }

}

exports.CustomEvent = CustomEvent;
//# sourceMappingURL=CustomEvent.js.map