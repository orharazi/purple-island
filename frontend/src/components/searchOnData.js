import React, { useState, useRef, useCallback } from 'react'
import { Container ,Card, Row, Col } from 'react-bootstrap'
import useObjectSearch from './useObjectSearch'

const SearchOnData = (props) => {
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const limitNumber = 10
  const currentModel = props.model
  const onClickFunc = (e) => props.onClickFunc(e)

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
      <Row className="justify-content-md-center">
        <Col lg={2}>
          <input 
          className="searchBox" 
          type="text" 
          value={query} 
          onChange={handleSearch}
          placeholder="Search here..."
          >
          </input>
        </Col>
      </Row>
      <Container className="cardContainer">
        <Row xs={1} md={4}>
        {Objects.map((object, index) => {
          return (
            <Col>
              <Card
                md={{span: 3, offset: 1}}
                ref={Objects.length === index + 1 ? lastObjectElementRef : null}
                key={object._id}
                className="cardStyled"
                onClick={() => props.onClick(object)}
              >
                <Card.Title key={object.username}>
                  {object.username}
                </Card.Title>
              </Card>
            </Col>
          )
        })}
        <div>{loading && 'Loading...'}</div>
        <div>{error && 'Error'}</div>
        </Row>
      </Container>
    </Container>

  )
}

export default SearchOnData