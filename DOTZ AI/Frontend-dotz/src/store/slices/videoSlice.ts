import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VideoState {
  isCameraOn: boolean;
  isMicOn: boolean;
  isScreenSharing: boolean;
  participants: string[];
  backgroundBlur: boolean;
}

const initialState: VideoState = {
  isCameraOn: true,
  isMicOn: true,
  isScreenSharing: false,
  participants: [],
  backgroundBlur: false,
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    toggleCamera: (state) => {
      state.isCameraOn = !state.isCameraOn;
    },
    toggleMic: (state) => {
      state.isMicOn = !state.isMicOn;
    },
    setScreenSharing: (state, action: PayloadAction<boolean>) => {
      state.isScreenSharing = action.payload;
    },
    addParticipant: (state, action: PayloadAction<string>) => {
      state.participants.push(action.payload);
    },
    removeParticipant: (state, action: PayloadAction<string>) => {
      state.participants = state.participants.filter(p => p !== action.payload);
    },
    toggleBackgroundBlur: (state) => {
      state.backgroundBlur = !state.backgroundBlur;
    },
  },
});

export const {
  toggleCamera,
  toggleMic,
  setScreenSharing,
  addParticipant,
  removeParticipant,
  toggleBackgroundBlur,
} = videoSlice.actions;
export default videoSlice.reducer;