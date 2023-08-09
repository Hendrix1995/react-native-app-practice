declare module 'react-native-keyboard-aware-scrollview' {
  import * as React from 'react';
  import { Constructor, ViewProps } from 'react-native';
  class KeyboardAwareScrollViewComponent extends React.Component<any> {}
  const KeyboardAwareScrollViewBase: KeyboardAwareScrollViewComponent & Constructor<any>;
  class KeyboardAwareScrollView extends KeyboardAwareScrollViewComponent {}
  export { KeyboardAwareScrollView };
}
