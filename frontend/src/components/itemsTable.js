import React from 'react'
import { useSelector } from 'react-redux'
import { Table } from 'react-bootstrap'

const ItemsTable = (props) => {
  const user = useSelector(state => state.user)
  const items = useSelector(state => state.items)
  const setItemsAdded = (items) => props.setItemsAdded(items)
  const setIsFill = (res) => props.setIsFill(res)
  const setError = (err) => props.setError(err)
  let itemsData = []


  const validateAmount = (ItemId, valueStr, max) => {
    // declare variables
    let value = parseInt(valueStr) //value as a int
    let objIndex = itemsData.findIndex(obj => obj.itemID === ItemId) //object index in data
    // if selected item as the value requested
      // if item is already in the list
      if (objIndex !== -1) {
        itemsData[objIndex].Amount = value
      // if item is not in the list
      } else {
        itemsData.push({
          itemID: ItemId,
          Amount: value,
          max: max
        })
      }
    // if selected item is not the value requested
    let isOk = itemsData.every(obj => obj.Amount <= obj.max && obj.Amount >= 0)
    if (!isOk) {
      setError('Amount must be between 0 and max items you own')
    } else {
      setError('')
    }
    // if all items are equel to 0
    let allZero = itemsData.every(obj => obj.Amount === 0)

    if (props.tradeVal) {
      let calcAll = itemsData.reduce((acc, curr) => {
        return acc + curr.Amount * items.find(item => item._id === curr.itemID).price
      }, 0)
      if (calcAll < props.tradeVal || !isOk) {
        !isOk && setError('Amount must be between 0 and max items you own')
        calcAll < props.tradeVal && setError('Bid offer value needs to be at least ' + props.tradeVal)
      } else {
        setError('')
      }
      isOk && !allZero && calcAll >= props.tradeVal ? setIsFill(false) : setIsFill(true)
    } else {
      !isOk ? setError('Amount must be between 0 and max items you own') : setError('')
      isOk && !allZero ? setIsFill(false) : setIsFill(true)
    }
    setItemsAdded(itemsData)
  }

  return (
    user.OwnedItems.length > 0 ? 
      <Table bordered>
      <thead>
        <tr>
          <th>Item Name</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {user.OwnedItems.map((item) => {
            let itemObject = items.find((i) => i._id === item.itemID)
            return (
              <tr key={itemObject.name}>
                <td>{itemObject.name}</td>
                <td>
                <input 
                  className="searchBox d-flex align-items-center" 
                  type="number" 
                  placeholder="Enter value..."
                  onChange={(e) => validateAmount(item.itemID, e.target.value, item.Amount)}
                />
                  available: {item.Amount}
                  </td>
              </tr>
            )
          })}
      </tbody>
      </Table>
    :
      <h1>The Game is OVER!</h1>
    
  )
}

export default ItemsTable