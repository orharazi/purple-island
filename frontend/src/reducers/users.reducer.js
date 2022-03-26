import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: '',
    avatar: '',
    OwnedItems: []
  },
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload.username
      state.avatar = action.payload.avatar
      state.OwnedItems = action.payload.OwnedItems
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUser } = userSlice.actions

export default userSlice.reducer