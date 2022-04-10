import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Container ,Card, Row, Col, ListGroup, Image} from 'react-bootstrap'
import useObjectSearch from './useObjectSearch'

import AddModal from './addModal'

const SearchOnData = (props) => {
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const items = useSelector(state => state.items)
  const limitNumber = 10
  const currentModel = props.model

  const {
    Objects,
    hasMore,
    loading,
    error
  } = useObjectSearch(query, pageNumber, limitNumber, currentModel)

  const callReload = () => {
    setPageNumber(1)
  }

  const observer = useRef()
  const lastObjectElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  function handleSearch(e) {
    setQuery(e.target.value)
    setPageNumber(1)
  }

  return (
    <Container className="searchContainer justify-content-md-center">
      <Row className="justify-content-md-center firstRow">
        <Col xs={1} lg={1} className="d-flex align-items-center">
          <img
            alt=""
            src="/static/add.png"
            width="30"
            height="30"
            className="d-flex align-items-center"
            style={{ cursor: "pointer"}}
            onClick={() => setShowAddModal(true)}
          />
          </Col>
        <Col xs={{span: 2, offset: 2}} lg={{span: 2, offset: 4}}>
          <input 
            className="searchBox d-flex align-items-center" 
            type="text" 
            value={query} 
            onChange={handleSearch}
            placeholder="Search here..."
          />
        </Col>
        <Col xs={5} lg={5}></Col>
      </Row>
      <Container className="cardContainer">
        <Row xs={1} md={4}>
        {Objects.map((object, index) => {
          let objectTitle = currentModel === "trades" ? object.offeredUsername : object.username
          let itemsToShow = currentModel === "trades" ? object.offeredItems : object.OwnedItems
          return (
            <Col key={object._id}>
              <Card
                key={index}
                md={{span: 3, offset: 1}}
                ref={Objects.length === index + 1 ? lastObjectElementRef : null}
                className="cardStyled"
                onClick={() => props.onClick(object)}
              >
                <Card.Title key={objectTitle}>
                  {objectTitle}
                </Card.Title>
                <ListGroup variant="flush">
                  {currentModel === "users" && object.isNew ? 
                  <p>Please generate items!</p>
                  :
                  itemsToShow.slice(0,2).map((item, index) => {
                    let itemObject = items.find((i) => i._id === item.itemID)
                    return (
                      <ListGroup.Item key={index}>{itemObject.name}: {item.Amount} {index === 1 && itemsToShow.length > 2 ? '& more...' : null}</ListGroup.Item>
                    )
                  })
                } 
                </ListGroup>
              </Card>
            </Col>
          )
        })}
        <div>
          {loading && 
          <>
          <Image src={'/static/loader.gif'} />
          <h1>Loading {currentModel}..</h1>
          </>
          }
        </div>
        <div>{error && 'Error'}</div>
        </Row>
      </Container>
      <AddModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        fields={props.fields}
        modelName={currentModel}
        handleSearch={() => handleSearch()}
        callReload={callReload}
      />
    </Container>
    

  )
}

export default SearchOnData