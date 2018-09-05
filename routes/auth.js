const express = require('express')
const db = require('../database')
const Joi = require('joi')

module.exports = (app, passport) => {

  app.post('/signup', passport.authenticate('local-signup'), (req, res) => {
    res.json({
      error: false,
      message: 'New user has been created'
    })
  })

  app.post('/signin', passport.authenticate('local-signin', {
    failureRedirect: '/failureLogin'
  }) , (req, res) => {
    res.json({
      error: false,
      message: 'Login success'
    })
  })

  app.get('/failureLogin', (req, res) => {
    res.json({
      error: true, 
      message: "Unauthorize 404"
    })
  })
  /*

  app.post('/auth/signup', (req, res) => {
    const schema = {
      username: Joi.required(),
      password: Joi.required()
    }

    const result = Joi.validate(req.body, schema)

    if (result.error) {
      res.status(400).send(result.error.details[0].message)
      return;
    }

    db.user.create(req.body)
    .then(user => {
      res.status(201).json({
        error: false,
        data: user,
        message: 'New user has been created'
      })
    })
    .catch(err => {
      res.json({
        error: true,
        error: err
      })
    })
  })
  */
}