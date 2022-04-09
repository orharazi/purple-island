import axios from 'axios'

export const getAllfromModel = async (model) => {
  const data = await axios.get(`/api/${model}`)
  return data.data
}

export const getFilteredfromModel = async (model,filteredObjName, filteredObjID) => {
  const data = await axios.get(`/api/${model}?${filteredObjName}=${filteredObjID}`)
  return data.data
}

export const getOnefromModel = async (model, id) => {
  const data = await axios.get(`/api/${model}/${id}`)
  return data.data
}

export const postNewToModel = async (model, data) => {
  const res = await axios.post(`/api/${model}`, data, {
    headers: {
      'Content-Type': model === "users" ? 'multipart/form-data' : 'application/json'  
    }
  })
  return res.data
}

export const putObjectToModel = async (model,data, id) => {
  const res = await axios.put(`/api/${model}/${id}`, data,{
    headers: {
      'Content-Type': model === "users" ? 'multipart/form-data' : 'application/json'
    }
  })
  return res.data
}