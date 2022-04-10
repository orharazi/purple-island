import { createSlice } from '@reduxjs/toolkit'

export const alertSlice = createSlice({
  name: 'alert',
  initialState: {
    show: false,
    status: null,
    message: null,
  },
  reducers: {
    setAlert: (state, action) => {
      state.show = true
      state.status = action.payload.status
      state.message = action.payload.message
    },
    setShow: (state) => {
      state.show = false
    }

  },
})

// Action creators are generated for each case reducer function
export const { setAlert, setShow } = alertSlice.actions

export default alertSlice.reducer