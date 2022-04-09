import React, { useState, useMemo } from "react"
import { Modal, ListGroup, Accordion, Button } from "react-bootstrap"
import ItemsTable from "./itemsTable"
import { postNewToModel } from '../functions/apiCalls'
import { useSelector } from "react-redux"
import { Link } from 'react-router-dom'


const BidModal = (props) => {
  const [itemsAdded, setItemsAdded] = useState([])
  const [isFill, setIsFill] = useState(true)
  const tradeVal = props.tradeVal
  const user = useSelector(state => state.user)

  const itemsTable = useMemo(() => {
    return (
      <ItemsTable 
        setItemsAdded = {(items) => setItemsAdded(items)}
        setIsFill = {(res) => setIsFill(res)}
        tradeVal={tradeVal}
      />
    )
  }, [])

  const onHide = () => {
    setIsFill(true)
    props.onHide()
  }

  const onSave = async () => {
   
    const FinalItems = itemsAdded.filter(obj => obj.Amount !== 0) //remove 0's
    console.log(FinalItems)
    let data = {
      tradeId: props.tradeId,
      biddingUser: props.userId,
      biddingUsername: props.username,
      offeredItems: FinalItems
    }
    setIsFill(true)
    props.onHide()
    const res = await postNewToModel('bids', data)
    console.log(res)
    await props.setBidsFunc()
  }

  return (
    <Modal
      show={props.show}
      onHide={onHide}
    >
      <Modal.Header>
        <h1>Make a Bid!</h1>
      </Modal.Header>
      <Modal.Body>
        {user.OwnedItems.length === 0 && user.isNew ? 
          <h3>Go to <Link to="/profile">profile</Link> and Generate Items!</h3>
        :
          itemsTable
        }
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onSave} disabled={isFill}>Create new Bid</Button>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default BidModal