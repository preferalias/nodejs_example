
const path = require('path')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const Constant = require('../constant')
const fs = require('fs')

const dbConfig = {
  operatorsAliases: Op,
}

const sequelize = new Sequelize(Constant.DB_URL, dbConfig)

const mapModels = () => {

  const db = {}

  fs
    .readdirSync(__dirname)
    .filter((file) => {
      return (file.indexOf('.js') !== 0 && file !== 'index.js')
    })
    .forEach((file) => {
      const model = sequelize.import(path.join(__dirname, file))
      db[model.name] = model
    })

    db.sequelize = sequelize
    db.Sequelize = Sequelize

    return db
}

const db = mapModels()
module.exports = db