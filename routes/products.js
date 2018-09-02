const express = require('express')
const router = express.Router()
const db = require('../database')
const Joi = require('joi')


router.get('/product/get', (req, res) => {
  db.product.findAll({})
    .then(products => res.json({
      error: false,
      data: products
    }))
    .catch(err => res.json({
      error: true,
      data:[],
      error: err
    }))
})

router.put('/product/update/:id', (req, res) => {
  const productID = req.params.id
  const {name, price} = req.body
  const result = validateSchema(req)

  if (result.error) {
    res.status(400).send(result.error.details[0].message)
    return;
  }

  db.product.update({
    name: name, 
    price: price 
  },
  {
    where: {
      id: productID
    }
  })
    .then(status => {
      console.log(status[0]);
      if(status[0] == 0){
        res.json({
          error: true,
          message: `not found product where id = ${productID}`
        })
      }else { 
        res.status(201).json({
          error: false,
          message: `Product ID ${productID} has been updated`
        })
      }
    })
    .catch(err => res.send(err))
})

router.post('/product/new', (req, res) => {
  const result = validateSchema(req)

  if (result.error) {
    res.status(400).send(result.error.details[0].message)
    return;
  }

  db.product.create(req.body)
    .then(product => {
      res.status(201).json({
        error: false,
        data: product,
        message: 'New product has been created'
      })
    })
    .catch(err => {
      res.json({
        error: true,
        error: err
      })
    })
})

router.delete('/product/delete/:id', (req, res) => {
  const productID = req.params.id

  db.product.destroy({
    where: {
      id: productID
    }
  })
    .then(status => {
      if(status === 0) {
        res.json({
          error: true,
          message: 'Product Not found'
        })
      }else if(status === 1){
        res.json({
          error: false,
          message: `Product ID ${productID} has been deleted`
        })
      }
    })
    .catch(err => res.send(err))
})

router.get('/' , function(req, res){
  res.redirect('http://www.google.co.th')
})

const validateSchema = (req) => {
  const schema = {
    name: Joi.required(),
    price: Joi.number().required()
  }
  return Joi.validate(req.body, schema)
}

module.exports = router