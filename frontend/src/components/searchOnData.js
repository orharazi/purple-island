import React, { useState, useRef, useCallback } from 'react'
import { Container ,Card, Row, Col} from 'react-bootstrap'
import useObjectSearch from './useObjectSearch'

import AddModal from './addModal'

const SearchOnData = (props) => {
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const limitNumber = 10
  const currentModel = props.model

  const {
    Objects,
    hasMore,
    loading,
    error
  } = useObjectSearch(query, pageNumber, limitNumber, currentModel)

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
      <h1>{currentModel} panel</h1>
      <Row className="justify-content-md-center firstRow">
        <Col lg={1} className="d-flex align-items-center">
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
        <Col lg={{span: 2, offset: 4}}>
          {currentModel !== "trades" &&
            <input 
              className="searchBox d-flex align-items-center" 
              type="text" 
              value={query} 
              onChange={handleSearch}
              placeholder="Search here..."
            />
          }
        </Col>
        <Col lg={5}></Col>
      </Row>
      <Container className="cardContainer">
        <Row xs={1} md={4}>
        {Objects.map((object, index) => {
          return (
            <Col key={object._id}>
              <Card
                key={index}
                md={{span: 3, offset: 1}}
                ref={Objects.length === index + 1 ? lastObjectElementRef : null}
                className="cardStyled"
                onClick={() => props.onClick(object)}
              >
                {currentModel === "trades" ?
                  <Card.Title key={object.offeredUsername}>
                    {object.offeredUsername}
                  </Card.Title>
                :  
                  <Card.Title key={object.username}>
                    {object.username}
                  </Card.Title>
                }
              </Card>
            </Col>
          )
        })}
        <div>{loading && 'Loading...'}</div>
        <div>{error && 'Error'}</div>
        </Row>
      </Container>
      <AddModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        fields={props.fields}
        modelName={currentModel}
        handleSearch={() => handleSearch()}
      />
    </Container>
    

  )
}

export default SearchOnData