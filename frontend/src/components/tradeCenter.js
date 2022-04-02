import React, { useState } from 'react'
import SearchOnData from './searchOnData'
// import {
//   useDispatch,
// } from 'react-redux'

const TradeCenter = () => {
  const onClickFunc = async (obj) => {}
  const fields = [
    {
      fieldName: "items",
      require: true
    }
  ]

  return (
    <SearchOnData 
      model={'trades'}
      onClick={onClickFunc}
      fields={fields}
    />
  )
}

export default TradeCenter
