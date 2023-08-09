import React from 'react';
import { TouchableWithoutFeedback, Keyboard, StyleProp, ViewStyle, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { TailwindFn } from 'twrnc';

const DismissKeyboardView: React.FC<{
  children: any;
  style?: StyleProp<ViewStyle> | TailwindFn;
}> = ({ children, ...props }) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAwareScrollView
      {...props}
      style={props.style}
      behavior={Platform.OS === 'android' ? 'position' : 'padding'}>
      {children}
    </KeyboardAwareScrollView>
  </TouchableWithoutFeedback>
);

export default DismissKeyboardView;
