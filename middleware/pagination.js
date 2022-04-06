const { query } = require("express")

function paginatedResults (model, valueToSearchOn) {
  return async (req, res, next) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const querySearch = req.query.q

    const relField = valueToSearchOn
    let queryRegex = {}
    queryRegex[relField] = { "$regex": querySearch, "$options": "i" }
    let relDocs = (querySearch !== undefined && querySearch !== '') ? valueToSearchOn === "offersUser" ? model.populate(valueToSearchOn).find(queryRegex) : model.find(queryRegex) : model
    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}

    if (endIndex < await relDocs.countDocuments().exec()) {
      results.next = {
        page: page + 1,
        limit: limit
      }
    }
    
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      }
    }
    try {
      results.results = await model.find((querySearch !== undefined && querySearch !== '') ? queryRegex : null).limit(limit).skip(startIndex).exec()
      res.paginatedResults = results
      next()
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  }
}

module.exports = paginatedResults