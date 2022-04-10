import axios from 'axios'

export const getAllfromModel = async (model) => {
  const data = await axios.get(`http://localhost:3000/api/${model}`)
  return data.data
}

export const getFilteredfromModel = async (model,filteredObjName, filteredObjID) => {
  const data = await axios.get(`http://localhost:3000/api/${model}?${filteredObjName}=${filteredObjID}`)
  return data.data
}

export const getOnefromModel = async (model, id) => {
  const data = await axios.get(`http://localhost:3000/api/${model}/${id}`)
  return data.data
}

export const postNewToModel = async (model, data) => {
  return axios.post(`http://localhost:3000/api/${model}`, data, {
    headers: {
      'Content-Type': model === "users" ? 'multipart/form-data' : 'application/json'  
    }
  }).then(res => {
    return res
  }).catch(err => {
    return err
  })
}

export const putObjectToModel = async (model,data, id) => {
  return axios.put(`http://localhost:3000/api/${model}/${id}`, data,{
    headers: {
      'Content-Type': model === "users" ? 'multipart/form-data' : 'application/json'
    }
  }).then(res => {
    return res
  }).catch(err => {
    return err
  })
}

export const getDeals = async (id) => {
  const data = await axios.get(`http://localhost:3000/api/confirmBid/${id}`)
  return data.data
}
