import axios from 'axios'

export const getAllfromModel = async (model) => {
  const data = await axios.get(`http://localhost:3000/api/${model}`)
  return data.data
}

export const getOnefromModel = async (model, id) => {
  const data = await axios.get(`http://localhost:3000/api/${model}/${id}`)
  return data.data
}

export const postNewToModel = async (model, data) => {
  console.log(typeof data)
  const res = await axios.post(`http://localhost:3000/api/${model}`, data, {
    headers: {
      'Content-Type': model === "trades" ? 'application/json' : 'multipart/form-data'
    }
  })
  return res.data
}

export const putObjectToModel = async (model,data, id) => {
  const res = await axios.put(`http://localhost:3000/api/${model}/${id}`, data,{
    headers: {
      'Content-Type': model === "trades" ? 'application/json' : 'multipart/form-data'
    }
  })
  return res.data
}