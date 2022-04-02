import { createSlice } from '@reduxjs/toolkit'

export const itemsSlice = createSlice({
  name: 'items',
  initialState: [{
    name: '',
    price: '',
  }],
  reducers: {
    setItems: (state, action) => {
      return [...action.payload]
    },
  },
})

// Action creators are generated for each case reducer function
export const { setItems } = itemsSlice.actions

export default itemsSlice.reducer