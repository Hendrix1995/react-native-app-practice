import * as React from 'react';
import { Provider } from 'react-redux';
import store from '@/store';
import AppInner from './AppInner';

export default function App() {
  return (
    <Provider store={store}>
      <AppInner />
    </Provider>
  );
}
