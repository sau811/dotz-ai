import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  activeModule: 'chat' | 'voice' | 'video' | null;
  isAuthModalOpen: boolean;
  isContactFormOpen: boolean;
  theme: 'light' | 'dark';
  interactionCount: number;
}

const initialState: UiState = {
  activeModule: null,
  isAuthModalOpen: false,
  isContactFormOpen: false,
  theme: 'dark',
  interactionCount: 0,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveModule: (state, action: PayloadAction<UiState['activeModule']>) => {
      state.activeModule = action.payload;
    },
    openAuthModal: (state) => {
      state.isAuthModalOpen = true;
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
    openContactForm: (state) => {
      state.isContactFormOpen = true;
    },
    closeContactForm: (state) => {
      state.isContactFormOpen = false;
    },
    incrementInteractionCount: (state) => {
      state.interactionCount += 1;
      if (state.interactionCount >= 5) {
        state.isAuthModalOpen = true;
      }
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const {
  setActiveModule,
  openAuthModal,
  closeAuthModal,
  openContactForm,
  closeContactForm,
  incrementInteractionCount,
  toggleTheme,
} = uiSlice.actions;
export default uiSlice.reducer;