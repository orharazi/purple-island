import React, { useState, useEffect, useMemo } from 'react'
import { Modal, Button, Form, Col } from 'react-bootstrap'
import ItemsTable from './itemsTable'
import { postNewToModel } from '../functions/apiCalls'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { setAlert } from '../reducers/alert.reducer'

const AddModal = (props) => {
  const dispatch = useDispatch()
  const [isFill, setIsFill] = useState(true)
  const user = useSelector(state => state.user)
  const [itemsAdded, setItemsAdded] = useState([])
  const [error, setError] = useState('')
  const fields = props.fields
  const modelName = props.modelName
  const callReload = () => props.callReload()
  let data = {}
  const itemsTable = useMemo(() => {
    return (
      <ItemsTable 
        setItemsAdded = {(items) => setItemsAdded(items)}
        setIsFill = {(res) => setIsFill(res)}
        setError={(err) => setError(err)}
      />
    )
  }, [])

  useEffect(() => {
    data["ownedItems"] = itemsAdded
  },[itemsAdded, isFill])

  const onHide = () => {
    props.onHide()
    setIsFill(true)
  }
  
  const onChangeField = (field, target) => {
    data[field.fieldName] = field.fieldName === "avatar" ? target.files[0] : target.value
    let relFields = fields.filter(field => field.require)
    if (Object.keys(data).length === relFields.length) {setIsFill(false)}
  }
  const onSave = async () => {
    let formData
    if (modelName === "trades" && itemsAdded.length > 0) {
      const FinalItems = itemsAdded.filter(obj => obj.Amount !== 0) //remove 0's
      formData = {
        'offeredUser': user.id,
        'offeredUsername': user.username,
        'offeredItems': FinalItems
      }
    } else {
      formData = new FormData()
      for (var key in data) {
        formData.append(key, data[key])
      }
    }
    const res = await postNewToModel(modelName, formData)
    let alertData = {
      status: res.status,
      message: res.data.message
    }
    dispatch(setAlert(alertData))
    callReload()
    onHide()
  }
  
  return (
    <Modal
      show={props.show}
      onHide={onHide}
      centered
    >
      <Modal.Header>
        <Col className="justify-content-md-center">
        <h1>Add {modelName}</h1>
        </Col>
      </Modal.Header>
      <Modal.Body>
        {modelName === "trades" ? 
          <h4>Please select items to Trade!</h4>
        : 
          <h4>Please fill all fields:</h4>
         }
         
        <Form>
        {modelName === "trades" ? 
          user.OwnedItems.length === 0 && user.isNew ? 
            <h3>Go to <Link to="/profile">profile</Link> and Generate Items!</h3>
          :
            itemsTable
        : 
          fields.map((field) => {
            return (
              <Form.Group className="mb-3" controlId={field.fieldName} key={field.fieldName}>
                <Form.Label>{field.fieldName}:</Form.Label>
                <Form.Control 
                  type={field.fieldName === "avatar" ? "file" : null} 
                  accept={field.fieldName === "avatar" ? ".png,.jpeg,.jpg" : null} 
                  placeholder={`Enter ${field.fieldName}`} 
                  onChange={(e) => onChangeField(field, e.target)}
                />
              </Form.Group>
            )
          })
         }

        </Form>
        {error !== '' && <p className="text-danger">{error}</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onSave} disabled={isFill}>Save</Button>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

  export default AddModal