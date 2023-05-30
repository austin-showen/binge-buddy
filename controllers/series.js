const Series = require('../models/series')
const mongoose = require('mongoose')
const axios = require('axios')
const API_KEY = process.env.API_KEY

const index = async (req, res) => {
  const series = await Series.find({ user: req.user._id })
  res.render('series/index', { title: 'My Binge List', series })
}

const create = async (req, res) => {
  if (await Series.find({ tmdbId: req.query.tmdbId })) {
    res.redirect('/series')
  } else {
    const tmdbId = req.query.tmdbId
    const response = await axios.get(
      `https://api.themoviedb.org/3/tv/${tmdbId}?language=en-US&api_key=${API_KEY}`
    )
    console.log(response)
    const series = new Series()

    try {
      series.name = response.data.name
      series.tmdbId = response.data.id
      series.description = response.data.overview
      series.seasons = response.data.seasons
      series.thumbnail = response.data.poster_path
      series.tmdbRating = response.data.vote_average
      series.user = req.user._id
      series.save()
    } catch (err) {
      console.log(err)
    }

    res.redirect('/series')
  }
}

module.exports = {
  index,
  create
}
