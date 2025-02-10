import { configureStore } from '@reduxjs/toolkit'
import editorReducer from './features/editor/editorSlice';
import contentPlayerReducer from './features/contentPlayer/contentPlayerSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
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