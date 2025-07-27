import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VoiceState {
  isRecording: boolean;
  audioUrl: string | null;
  volume: number;
}

const initialState: VoiceState = {
  isRecording: false,
  audioUrl: null,
  volume: 1.0,
};

const voiceSlice = createSlice({
  name: 'voice',
  initialState,
  reducers: {
    setRecording: (state, action: PayloadAction<boolean>) => {
      state.isRecording = action.payload;
    },
    setAudioUrl: (state, action: PayloadAction<string | null>) => {
      state.audioUrl = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
  },
});

export const { setRecording, setAudioUrl, setVolume } = voiceSlice.actions;
export default voiceSlice.reducer;