import React, {useEffect, useState} from "react"
import { Modal, ListGroup, Accordion, Button } from "react-bootstrap"
import { useSelector } from "react-redux"
import BidModel from "./bidModal"
import { getFilteredfromModel, postNewToModel } from "../functions/apiCalls"

const TradeModal = (props) => {
  const [showAddBid, setShowAddBid] = useState(false)
  const [bids, setBids] = useState([])
  const user = useSelector(state => state.user)
  const items = useSelector(state => state.items)
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
    console.log('confirm: ', {tradeData})
    const res = await postNewToModel('confirmBid', {tradeData})
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
        {!isTradeAdmin && <Button onClick={() => setShowAddBid(true)}> Add bid!</Button>}
        <h1>Trade By {trade.offeredUsername}</h1>
      </Modal.Header>
      <Modal.Body>
        <h3>trade Items:</h3>
        <ListGroup variant="flush">
          {trade.offeredItems.map((item, index) => {
            let itemObject = items.find((i) => i._id === item.itemID)
            return (
              <ListGroup.Item key={index}>{itemObject.name}: {item.Amount}</ListGroup.Item>
            )
          })}
        </ListGroup>
        <h3>current Bids: </h3>
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