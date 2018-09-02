const express = require('express')
const router = express.Router()
const db = require('../database')
const Joi = require('joi')

router.get('/auth/login', (req, res) => {
  res.send('Login')
})

router.get('/auth/register', (req, res) => {
  res.send('Register Here')
})

module.exports = router