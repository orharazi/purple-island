import React, { useState } from 'react'
import { Alert, ToastContainer, Toast } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { setShow } from '../reducers/alert.reducer'

const AlertComponent = () => {
  const alert = useSelector(state => state.alert)
  const dispatch = useDispatch()

  const onClose = () => {
    dispatch(setShow())
  }

  return (
    <ToastContainer position='bottom-start'>
      <Toast 
        show={alert.show} 
        bg={alert.status === 200 ? "success" : "danger"}
        onClose={onClose} 
        delay={3000} 
        autohide
      >
        <Toast.Header>
          <strong className="me-auto">status {alert.status}</strong>
          <small className="text-muted">just now</small>
        </Toast.Header>
        <Toast.Body>{alert.message}</Toast.Body>
      </Toast>
    </ToastContainer>
  )
}

export default AlertComponent