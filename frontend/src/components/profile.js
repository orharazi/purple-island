import React, {useState, useEffect} from 'react'
import { InputGroup, Container, FormControl, Row, Button, Col, Table} from 'react-bootstrap'
import { setNotNew, setUserItems } from '../reducers/users.reducer'
import {
  useSelector,
  useDispatch
} from 'react-redux'
import { useNavigate  } from 'react-router'
import { putObjectToModel } from '../functions/apiCalls'

const Profile = () => {
  const user = useSelector(state => state.user)
  const items = useSelector(state => state.items)
  const [username, setUsername] = useState(user.username ? user.username : null)
  const [avatar, setAvatar] = useState(null)
  const [newItems, setNewItems] = useState(user.OwnedItems ? user.OwnedItems : [])
  const [isNew, setIsNew] = useState(user.isNew)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const uploadAvatar = (e) => {
    setAvatar(e.target.files[0])
  }

  const selectRandom = (min,max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  const getRandomObj = (selectedItems, selectedValue) => {
    //select random object
    let selectedObjectIdx = selectRandom(0, items.length)
    let selectedObj = items[selectedObjectIdx]

    //compute total amount of all object alraedy in array
    const sum = selectedItems.reduce(
      (total, item) => total + item.price, 
    0)

    //compute total amount of all object in array + new one
    const sumPlusNew = parseInt(sum) + parseInt(selectedObj.price)

    //if the sum with the new is over the selected value, return array without the new object
    if (sumPlusNew > selectedValue) {
      //if there are items in array, return array
      if (selectedItems.lenght > 0) {        
        return selectedItems
        //if there aren't items in array, try again with empty array
      } else {
        return getRandomObj([], selectedValue)
      }
      //if the sum with the new is equel the selected value, return array with the new object
    } else if (sumPlusNew === selectedValue) {      
      return [...selectedItems, selectedObj]
      //if the sum with the new is lower the selected value, add the item and run again
    } else {
      return getRandomObj([...selectedItems, selectedObj], selectedValue)
    }
  }

  const generateItems = () => {
    const selectedValue = selectRandom(3, 21)    
    let endItems = getRandomObj([], selectedValue)    
    let itemsObject = []
    endItems.forEach((item) => {
      if (itemsObject[item._id]) {
        itemsObject[item._id] = itemsObject[item._id] + 1
      } else {
        itemsObject[item._id] = 1
      }
    })
    const itemsToDb = Object.entries(itemsObject).map((item) => {
      return {
        itemID: item[0],
        Amount: item[1]
      }
    })
    setNewItems(itemsToDb)
  }



  const onSave = async () => {

    const data = {}
    if (username !== user.username) {
      data['username'] = username
    }
    if (avatar !== null) {      
      data['avatar'] = avatar
    }
    if (newItems.length > 0 && isNew) {      
      dispatch(setNotNew)
      dispatch(setUserItems(newItems))
      setIsNew(false)
      data['OwnedItems'] = newItems
      
    }    
    let formData = new FormData()
    for (var key in data) {
      if (typeof data[key] === 'object' && key !== "avatar") {        
        formData.append(key, JSON.stringify(data[key]))
      } else {
      formData.append(key, data[key])
      }
    }

    await putObjectToModel('users',formData, user.id )
    navigate('/')
  }
  
  return (
    <Container className="profileContainer">
      <h1>User Profile</h1>
      <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1">Username</InputGroup.Text>
        <FormControl
          placeholder="Enter Username.."
          aria-label="Username"
          aria-describedby="basic-addon1"
          defaultValue={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <FormControl
          type="file"
          aria-label="Avatar"
          aria-describedby="User avatar"
          title="Choose your Avatar"
          label="Choose your Avatar"
          accept=".png,.jpeg,.jpg"
          onChange={(e) => uploadAvatar(e)}
        />
      </InputGroup>
      <div className="items">
        <h3>User Items: </h3>
        
        {newItems.length === 0 && isNew ? 
          <Button variant="warning" onClick={generateItems}>Generate Items</Button>
          :
          (
            newItems.length > 0 ? 
              <Table bordered>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {newItems.map((item) => {
                    let itemObject = items.find((i) => i._id === item.itemID)
                    return (
                      <tr key={itemObject.name}>
                        <td>{itemObject.name}</td>
                        <td>{item.Amount}</td>
                      </tr>
                    )
                  })}
              </tbody>
              </Table>
            :
              <h1>The Game is OVER!</h1>
          )
        }
      </div>
      <Row>
        <Col md={1}>
          <Button variant="success" onClick={onSave} disabled={newItems.length < 0}>Save</Button>
        </Col>
        <Col md={1}>
          <Button variant="danger" onClick={() => navigate('/')}>Back</Button>
        </Col>
      </Row>
    </Container>
  )
}

export default Profile