import React, { useEffect, useState } from "react"
import { Modal, ListGroup, Accordion, Button, Row, Col } from "react-bootstrap"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate  } from "react-router-dom";
import BidModel from "./bidModal"
import { getFilteredfromModel, postNewToModel, getOnefromModel } from "../functions/apiCalls"
import { setUser } from "../reducers/users.reducer";
import { setAlert } from '../reducers/alert.reducer'

const TradeModal = (props) => {
  const [showAddBid, setShowAddBid] = useState(false)
  const [bids, setBids] = useState([])
  const user = useSelector(state => state.user)
  const items = useSelector(state => state.items)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const trade = props.trade
  const isTradeAdmin = user.id === trade.offeredUser
  const tradeVal = trade.offeredItems.reduce((acc, curr) => {
    return acc + curr.Amount * items.find(item => item._id === curr.itemID).price
  }, 0)

  const setBidsFunc = async () => {
    const bidsByTrade = await getFilteredfromModel('bids','tradeId', trade._id)
    setBids(bidsByTrade)
  }

  useEffect(() => {
    props.show && setBidsFunc()
  }, [props.show])
  
  const onHide = () => {
    setBids([])
    props.onHide()
  }

  const onCLickConfirm = async (bid) => {
    const tradeData = {
      openTradeUser: {
        id: user.id,
        itemsToTrade: trade.offeredItems
      },
      createBidUser: {
        id: bid.biddingUser,
        itemsToTrade: bid.offeredItems
      },
      tradeId: trade._id,
      bidId: bid._id
    }
    const res = await postNewToModel('confirmBid', {tradeData})
    if (res.status === 200) {
      const userData = await getOnefromModel("users", user.id)
      await Promise.resolve(dispatch(setUser(userData)))
    }
    let alertData = {
      status: res.status,
      message: res.data.message
    }
    dispatch(setAlert(alertData))
    onHide()
    navigate('/profile')
  }


  return (
    <>
    <Modal
      show={props.show}
      onHide={onHide}
      size="lg"
      centered
    >
      <Modal.Header>
        <Col lg={2} className="">
          {!isTradeAdmin && <Button onClick={() => setShowAddBid(true)}> Add bid!</Button>}
        </Col>
        <Col lg={8}>
          <h1 className="">Trade By {trade.offeredUsername}</h1>
          <h4> value of: {tradeVal} points</h4>
        </Col>
        <Col lg={2}></Col>
      </Modal.Header>
      <Modal.Body>
        <h3>Trade Items:</h3>
        <ListGroup variant="flush">
          {trade.offeredItems.map((item, index) => {
            let itemObject = items.find((i) => i._id === item.itemID)
            return (
              <ListGroup.Item key={index}>{itemObject.name}: {item.Amount}</ListGroup.Item>
            )
          })}
        </ListGroup>
        <h3>Current Bids: </h3>
        <Accordion>
          {bids.length > 0 ? 
            bids.map((bid, index) => {
              let totalValueOfBid = bid.offeredItems.reduce((acc, curr) => {
                return acc + curr.Amount * items.find(item => item._id === curr.itemID).price
              }, 0)
              return (
                <Accordion.Item
                  eventKey={bid._id}
                  key={index}
                >
                  <Accordion.Header>
                    <h4>Bid By {bid.biddingUsername}, price of {totalValueOfBid}</h4>
                  </Accordion.Header>
                  <Accordion.Body>
                    <ListGroup variant="flush">
                      {bid.offeredItems.map((item, index) => {
                        let itemObject = items.find((i) => i._id === item.itemID)
                        return (
                          <ListGroup.Item key={index}>{itemObject.name}: {item.Amount}</ListGroup.Item>
                        )
                      })}
                    </ListGroup>
                    {isTradeAdmin && 
                      <Button style={{ marginTop: 10 }} variant="success" onClick={() => onCLickConfirm(bid)}>Confirm Bid!</Button>
                    }
                    </Accordion.Body>
                </Accordion.Item>
              )
            })
          : <h3>There are no bids!</h3>}
        </Accordion>
      </Modal.Body>
    </Modal>
    <BidModel 
      show={showAddBid}
      onHide={() => setShowAddBid(false)}
      tradeId={trade._id}
      userId={user.id}
      tradeVal={tradeVal}
      username={user.username}
      setBidsFunc={setBidsFunc}
    />
    </>
  )
}

export default TradeModal