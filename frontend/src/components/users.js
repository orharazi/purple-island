import React, { useState } from 'react'
import SearchOnData from './searchOnData'
import { useNavigate  } from 'react-router'
import {
  useDispatch,
} from 'react-redux'
import { setUser } from '../reducers/users.reducer'

const Users = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const onClickFunc = async (obj) => {
    localStorage.setItem('prevUser', JSON.stringify(obj))
    await Promise.resolve(dispatch(setUser(obj)))
    navigate('/')
  }

  return (
    <SearchOnData 
      model={'users'}
      onClick={onClickFunc}
    />
  )
}

export default Users