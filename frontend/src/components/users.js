import React from 'react'
import SearchOnData from './searchOnData'
import { useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import { setUser } from '../reducers/users.reducer'

const Users = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const onClickFunc = async (obj) => {
    localStorage.setItem('prevUser', JSON.stringify(obj))
    await Promise.resolve(dispatch(setUser(obj)))
    navigate('/')
  }
  const fields = [
    {
      fieldName: "username",
      require: true
    }, {
      fieldName: "avatar",
      require: false
    }
  ]

  return (
    <>
      <h1>Users panel</h1>
      <SearchOnData 
        model={'users'}
        onClick={onClickFunc}
        fields={fields}
      />
    </>
  )
}

export default Users