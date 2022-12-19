/* Copyright Airship and Contributors */

'use strict';

/**
 * Tag group operation.
 * @hidden
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TagGroupEditor = void 0;
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * Editor for tag groups.
 */
class TagGroupEditor {
  /**
   * TagGroupEditor constructor
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
   * Adds tags to a tag group.
   *
   * @param tagGroup The tag group.
   * @param tags Tags to add.
   * @return The tag group editor instance.
   */
  addTags(group, tags) {
    const operation = {
      "operationType": "add",
      "group": group,
      "tags": tags
    };
    this.operations.push(operation);
    return this;
  }

  /**
   * Removes tags from the tag group.
   *
   * @param tagGroup The tag group.
   * @param tags Tags to remove.
   * @return The tag group editor instance.
   */
  removeTags(group, tags) {
    const operation = {
      "operationType": "remove",
      "group": group,
      "tags": tags
    };
    this.operations.push(operation);
    return this;
  }

  /**
   * Overwrite the current set of tags on the Tag Group.
   *
   * @param tagGroup The tag group.
   * @param tags Tags to set.
   * @return The tag group editor instance.
   */
  setTags(group, tags) {
    const operation = {
      "operationType": "set",
      "group": group,
      "tags": tags
    };
    this.operations.push(operation);
    return this;
  }

  /**
   * Applies the tag changes.
   */
  apply() {
    this.onApply(this.operations);
  }
}
exports.TagGroupEditor = TagGroupEditor;
//# sourceMappingURL=TagGroupEditor.js.map