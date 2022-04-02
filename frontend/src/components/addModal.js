import React, { useState, useEffect, useMemo } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import ItemsTable from './itemsTable'
import {postNewToModel} from '../functions/apiCalls'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const AddModal = (props) => {
  const [isFill, setIsFill] = useState(true)
  const user = useSelector(state => state.user)
  const [itemsAdded, setItemsAdded] = useState([])
  const fields = props.fields
  const modelName = props.modelName
  let data = {}
  const itemsTable = useMemo(() => {
    return (
      <ItemsTable 
        setItemsAdded = {(items) => setItemsAdded(items)}
        setIsFill = {(res) => setIsFill(res)}
      />
    )
  }, [])

  useEffect(() => {
    console.log("state changes!: ", itemsAdded)
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
  const onSave = () => {
    let formData
    if (modelName === "trades" && itemsAdded.length > 0) {
      formData = {
        'offeredUser': user.id,
        'offeredUsername': user.username,
        'offeredItems': itemsAdded
      }
    } else {
      formData = new FormData()
      for (var key in data) {
        formData.append(key, data[key])
      }
    }
    postNewToModel(modelName, formData)
    onHide()
  }
  
  return (
    <Modal
      show={props.show}
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title className="justify-content-md-center">
          Add {modelName}
        </Modal.Title>
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
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onSave} disabled={isFill}>Save</Button>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

  export default AddModal