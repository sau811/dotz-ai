import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import chatReducer from './slices/chatSlice';
import voiceReducer from './slices/voiceSlice';
import videoReducer from './slices/videoSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    chat: chatReducer,
    voice: voiceReducer,
    video: videoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;