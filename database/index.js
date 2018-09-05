const path = require('path')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const Constant = require('../constant')
const fs = require('fs')
const env = Constant.NODE_ENV || "development"
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env]

const dbConfig = {
  operatorsAliases: Op,
}

const sequelize = new Sequelize(config.DB_URI, dbConfig)

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

    Object.keys(db).forEach(function(modelName) {
      if ("associate" in db[modelName]) {
          db[modelName].associate(db);
      }
    });

    db.sequelize = sequelize
    db.Sequelize = Sequelize

    return db
}

const db = mapModels()
module.exports = db