import { configureStore } from '@reduxjs/toolkit'
import editorReducer from './features/editor/editorSlice';
import contentPlayerReducer from './features/contentPlayer/contentPlayerSlice';
import authReducer from './features/auth/authSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      contentPlayer: contentPlayerReducer,
      editor: editorReducer
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']