/* Copyright Airship and Contributors */

'use strict';

/**
 * Attribute operation
 * @hidden
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AttributeEditor = void 0;
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * Editor for attributes.
 */
class AttributeEditor {
  /**
   * AttributeEditor constructor
   *
   * @hidden
   * @param onApply The apply function
   */
  constructor(onApply) {
    _defineProperty(this, "onApply", void 0);
    _defineProperty(this, "operations", void 0);
    this.onApply = onApply;
    this.operations = [];
  }

  /**
   * Adds an attribute.
   *
   * @param value The attribute value.
   * @param name The attribute name.
   * @return The attribute editor instance.
   */
  setAttribute(name, value) {
    var attributeValue;
    var attributeType;
    if (typeof value == "boolean") {
      // No boolean attribute type. Convert value to string.
      attributeValue = value.toString();
      attributeType = "string";
    } else {
      attributeValue = value;
      if (typeof value === "string") {
        attributeType = "string";
      } else if (typeof attributeValue === "number") {
        attributeType = "number";
      } else if (value instanceof Date) {
        // JavaScript's date type doesn't pass through the JS to native bridge.
        // Dates are instead serialized as milliseconds since epoch.
        attributeType = "date";
        attributeValue = value.getTime();
      } else {
        throw "Unsupported attribute type: " + typeof attributeValue;
      }
    }
    const operation = {
      "action": "set",
      "value": attributeValue,
      "key": name,
      type: attributeType
    };
    this.operations.push(operation);
    return this;
  }

  /**
   * Removes an attribute.
   * @param name The name of the attribute to remove.
   * @return The attribute editor instance.
   */
  removeAttribute(name) {
    const operation = {
      "action": "remove",
      "key": name
    };
    this.operations.push(operation);
    return this;
  }

  /**
   * Applies the attribute operations.
   */
  apply() {
    this.onApply(this.operations);
  }
}
exports.AttributeEditor = AttributeEditor;
//# sourceMappingURL=AttributeEditor.js.map