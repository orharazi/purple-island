import { useEffect, useState } from "react"
import axios from 'axios'

export default function useObjectSearch(query, pageNumber, limitNumber, modelName) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [Objects, setObjects] = useState([])
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    if (pageNumber === 1) {
      setObjects([])
    }
  }, [pageNumber])

  useEffect(() => {
    setObjects([])
  }, [query])

  useEffect(() => {
    setLoading(true)
    setError(false)
    let cancel
    axios({
      method: 'GET',
      url: `http://localhost:3000/api/${modelName}`,
      params: { page: pageNumber, limit: limitNumber, q: query },
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(res => {
      setObjects(prevObjects => {
        return [...new Set([...prevObjects, ...res.data.results])]
      })
      setHasMore(res.data.next)
      setLoading(false)
    }).catch(e => {
      if (axios.isCancel(e)) return
      setError(true)
    })
    return () => cancel()
  }, [query, pageNumber])

  return { loading, error, Objects, hasMore }
}