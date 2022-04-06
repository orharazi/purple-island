import React, { useState } from 'react'
import SearchOnData from './searchOnData'
import TradeModel from './tradeModal'
// import {
//   useDispatch,
// } from 'react-redux'

const TradeCenter = () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedTrade, setSelectedTrade] = useState(null)
  const onClickFunc = async (trade) => {
    setShowModal(true)
    setSelectedTrade(trade)
  }
  const fields = [
    {
      fieldName: "items",
      require: true
    }
  ]

  return (
    <>
    <SearchOnData 
      model={'trades'}
      onClick={onClickFunc}
      fields={fields}
    />
    {selectedTrade !== null &&
      <TradeModel 
        show={showModal}
        onHide={() => setShowModal(false)}
        trade={selectedTrade}
      />
    }

    </>
  )
}

export default TradeCenter
