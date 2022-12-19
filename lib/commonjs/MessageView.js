/* Copyright Airship and Contributors */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MessageView = exports.MessageLoadError = void 0;

var _react = _interopRequireDefault(require("react"));

var _MessageViewNativeComponent = _interopRequireDefault(require("./MessageViewNativeComponent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Enum of possible message load errors
 */
let MessageLoadError;
/**
 * Message load started event.
 */

exports.MessageLoadError = MessageLoadError;

(function (MessageLoadError) {
  MessageLoadError["NotAvailable"] = "MESSAGE_NOT_AVAILABLE";
  MessageLoadError["FetchFailed"] = "FAILED_TO_FETCH_MESSAGE";
  MessageLoadError["LoadFailed"] = "MESSAGE_LOAD_FAILED";
})(MessageLoadError || (exports.MessageLoadError = MessageLoadError = {}));

/**
 * Inbox message view component.
 */
class MessageView extends _react.default.Component {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_onLoadStarted", event => {
      if (!this.props.onLoadStarted) {
        return;
      }

      this.props.onLoadStarted(event.nativeEvent);
    });

    _defineProperty(this, "_onLoadFinished", event => {
      if (!this.props.onLoadFinished) {
        return;
      }

      this.props.onLoadFinished(event.nativeEvent);
    });

    _defineProperty(this, "_onLoadError", event => {
      if (!this.props.onLoadError) {
        return;
      }

      this.props.onLoadError(event.nativeEvent);
    });

    _defineProperty(this, "_onClose", event => {
      if (!this.props.onClose) {
        return;
      }

      this.props.onClose(event.nativeEvent);
    });
  }

  render() {
    return /*#__PURE__*/_react.default.createElement(_MessageViewNativeComponent.default, _extends({}, this.props, {
      onLoadError: this._onLoadError,
      onLoadStarted: this._onLoadStarted,
      onLoadFinished: this._onLoadFinished,
      onClose: this._onClose
    }));
  }

}

exports.MessageView = MessageView;
//# sourceMappingURL=MessageView.js.map