import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: null,
    username: '',
    avatar: '',
    OwnedItems: [],
    isNew: true
  },
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload._id
      state.username = action.payload.username
      state.avatar = action.payload.avatar
      state.OwnedItems = action.payload.OwnedItems
      state.isNew =action.payload.isNew
    },
    setNotNew: (state) => {
      state.isNew = false
    },
    setUserItems: (state, action) => {
      state.OwnedItems = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUser, setNotNew, setUserItems } = userSlice.actions

export default userSlice.reducer