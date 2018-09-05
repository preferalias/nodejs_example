const session = require('express-session')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Constant = require('./constant')
const products = require('./routes/products')
const db = require('./database')
const passport = require('passport')

let port = Constant.PORT || 3000

db
  .sequelize
  .sync({force: true})
 
db.sequelize.authenticate()
  .then(() => console.log('Connection success'))
  .catch(err => console.log(err));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
  cookie:{
    httpOnly: false
  },
  secret: 'our-secret',
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use('/api' , products)

require('./passport')(passport, db.user);

const authRoute = require('./routes/auth')(app, passport)

// throw 404 error to error handler
/*app.use((req, res, next) => {
  console.log('req.session' , req.session)
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})
*/
app.listen(port , () => console.log('Starting on port : ' + port));