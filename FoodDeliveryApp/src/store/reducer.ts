import { combineReducers } from 'redux';

import user from '../slices/user';

const rootReducer = combineReducers({
  user: user.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
