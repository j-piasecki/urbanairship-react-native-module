/* Copyright Airship and Contributors */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScopedSubscriptionListEditor = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Enum of internal scoped subscription list update type.
 * @hidden
 */
var ScopedSubscriptionListUpdateType;
/**
 * Scoped subscription list operation.
 * @hidden
 */

(function (ScopedSubscriptionListUpdateType) {
  ScopedSubscriptionListUpdateType["subscribe"] = "subscribe";
  ScopedSubscriptionListUpdateType["unsubscribe"] = "unsubscribe";
})(ScopedSubscriptionListUpdateType || (ScopedSubscriptionListUpdateType = {}));

/**
 * Scoped subscription list editor.
 */
class ScopedSubscriptionListEditor {
  /**
   */
  constructor(onApply) {
    _defineProperty(this, "onApply", void 0);

    _defineProperty(this, "subscriptionListUpdates", void 0);

    this.onApply = onApply;
    this.subscriptionListUpdates = [];
  }
  /**
   * Subscribes to a list in the given scope.
   *
   * @param subscriptionListId The subscription list identifier.
   * @param scope The subscription scope to subscribe.
   */


  subscribe(subscriptionListId, scope) {
    const operation = {
      "listId": subscriptionListId,
      "type": ScopedSubscriptionListUpdateType.subscribe,
      "scope": scope
    };
    this.subscriptionListUpdates.push(operation);
    return this;
  }
  /**
  * Unsubscribe from a list.
  *
  * @param subscriptionListId The subscription list identifier.
  * @param scope The subscription scope to unsubscribe.
  */


  unsubscribe(subscriptionListId, scope) {
    const operation = {
      "listId": subscriptionListId,
      "type": ScopedSubscriptionListUpdateType.unsubscribe,
      "scope": scope
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

exports.ScopedSubscriptionListEditor = ScopedSubscriptionListEditor;
//# sourceMappingURL=ScopedSubscriptionListEditor.js.map