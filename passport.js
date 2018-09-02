const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , db = require('./database')

// Serialize Sessions
passport.serializeUser((user, done) => {
  done(null, user)
})

// Deserialize Sessions
passport.deserializeUser((user, done) => {
  db.user.find({
    where: {
      id: user.id
    }
  })
    .then((user) => {
      done(null, user)
    })
    .catch((err) => {
      done(err, null)
    })
})
passport.use(new LocalStrategy(
  (username, password, done) => {
    db.user.find({
      where: {
        username: username
      }
    })
      .then((user) => {
        passwd = user ? user.password : ''
        isMatch = db.user.validPassword(password, passwd, done, user)
      })
  }
))