
/**
 * This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
 *
 * Do not edit this file as changes may cause incorrect behavior and will be lost
 * once the code is regenerated.
 *
 * @generated by codegen project: GeneratePropsH.js
 */
#pragma once

#include <jsi/jsi.h>
#include <react/renderer/components/view/ViewProps.h>
#include <react/renderer/core/PropsParserContext.h>

namespace facebook {
namespace react {

class JSI_EXPORT UARCTMessageViewProps final : public ViewProps {
 public:
  UARCTMessageViewProps() = default;
  UARCTMessageViewProps(const PropsParserContext& context, const UARCTMessageViewProps &sourceProps, const RawProps &rawProps);

#pragma mark - Props

  std::string messageId{};
};

} // namespace react
} // namespace facebook
