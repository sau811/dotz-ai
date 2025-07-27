import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

interface ChatState {
  messages: Message[];
  isTyping: boolean;
}

const initialState: ChatState = {
  messages: [],
  isTyping: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { addMessage, setTyping, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;