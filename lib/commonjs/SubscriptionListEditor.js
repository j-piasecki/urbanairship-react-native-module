/* Copyright Airship and Contributors */
'use strict';
/**
 * Enum of internal subscription list update type.
 * @hidden
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SubscriptionListEditor = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SubscriptionListUpdateType;
/**
 * Subscription list operation.
 * @hidden
 */

(function (SubscriptionListUpdateType) {
  SubscriptionListUpdateType["subscribe"] = "subscribe";
  SubscriptionListUpdateType["unsubscribe"] = "unsubscribe";
})(SubscriptionListUpdateType || (SubscriptionListUpdateType = {}));

/**
 * Subscription list editor.
 */
class SubscriptionListEditor {
  /**
   */
  constructor(onApply) {
    _defineProperty(this, "onApply", void 0);

    _defineProperty(this, "subscriptionListUpdates", void 0);

    this.onApply = onApply;
    this.subscriptionListUpdates = [];
  }
  /**
   * Subscribes to a list.
   *
   * @param subscriptionListId The subscription list identifier.
   */


  subscribe(subscriptionListId) {
    const operation = {
      "listId": subscriptionListId,
      "type": SubscriptionListUpdateType.subscribe
    };
    this.subscriptionListUpdates.push(operation);
    return this;
  }
  /**
  * Unsubscribe from a list.
  *
  * @param subscriptionListId The subscription list identifier.
  */


  unsubscribe(subscriptionListId) {
    const operation = {
      "listId": subscriptionListId,
      "type": SubscriptionListUpdateType.unsubscribe
    };
    this.subscriptionListUpdates.push(operation);
    return this;
  }
  /**
  * Applies subscription list changes.
  *
  */


  apply() {
    this.onApply(this.subscriptionListUpdates);
  }

}

exports.SubscriptionListEditor = SubscriptionListEditor;
//# sourceMappingURL=SubscriptionListEditor.js.map