import { configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/users.reducer'
import itemsReducer from './reducers/items.reducer'
import alertReducer from './reducers/alert.reducer'

const store = configureStore({
  reducer: {
    user: userReducer,
    items: itemsReducer,
    alert: alertReducer
  },
})

export default store