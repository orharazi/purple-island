import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/users.reducer'
import itemsReducer from './reducers/items.reducer'

const store = configureStore({
  reducer: {
    user: userReducer,
    items: itemsReducer
  },
})

export default store