import React, { useState, useMemo } from "react"
import { Modal, Col, Button } from "react-bootstrap"
import ItemsTable from "./itemsTable"
import { postNewToModel } from '../functions/apiCalls'
import { useSelector, useDispatch } from "react-redux"
import { Link } from 'react-router-dom'
import { setAlert } from '../reducers/alert.reducer'



const BidModal = (props) => {
  const dispatch = useDispatch()
  const [itemsAdded, setItemsAdded] = useState([])
  const [isFill, setIsFill] = useState(true)
  const [error, setError] = useState('')
  const tradeVal = props.tradeVal
  const user = useSelector(state => state.user)

  const itemsTable = useMemo(() => {
    return (
      <ItemsTable 
        setItemsAdded = {(items) => setItemsAdded(items)}
        setIsFill = {(res) => setIsFill(res)}
        tradeVal={tradeVal}
        setError={(err) => setError(err)}
      />
    )
  }, [])

  const onHide = () => {
    setIsFill(true)
    props.onHide()
  }

  const onSave = async () => {
   
    const FinalItems = itemsAdded.filter(obj => obj.Amount !== 0) //remove 0's
    let data = {
      tradeId: props.tradeId,
      biddingUser: props.userId,
      biddingUsername: props.username,
      offeredItems: FinalItems
    }
    setIsFill(true)
    props.onHide()
    const res = await postNewToModel('bids', data)
    let alertData = {
      status: res.status,
      message: res.data.message
    }
    dispatch(setAlert(alertData))
    await props.setBidsFunc()
  }

  return (
    <Modal
      show={props.show}
      onHide={onHide}
      centered
    >
      <Modal.Header>
        <Col className="justify-content-md-center">
          <h1>Make a Bid!</h1>
        </Col>
      </Modal.Header>
      <Modal.Body>
        {user.OwnedItems.length === 0 && user.isNew ? 
          <h3>Go to <Link to="/profile">profile</Link> and Generate Items!</h3>
        :
          itemsTable
        }
        {error !== '' && <p className="text-danger">{error}</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onSave} disabled={isFill}>Create new Bid</Button>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default BidModal