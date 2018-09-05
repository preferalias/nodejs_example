const bCrypt = require('bcrypt-nodejs')

module.exports = (passport, user) => {
  let User = user
  let LocalStrategy = require('passport-local').Strategy

  passport.serializeUser((user,done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then((user) => {
        if(user){
          done(null, user.get())
        } else {
          done(user.error, null)
        } 
      })
  })

  passport.use('local-signup', new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req, username, password, done) => {
        console.log(req.body)
        console.log(username + 'this is PASSWORD !!! ' + password)
        let generateHash = (password) => {
          return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null)
        }
        User.findOne({where: {username: username}}).then(user => {
          if(user) { return done(null,false, {message: 'Username is already taken'}) }
          else {
            let userPassword = generateHash(password)
            let data = {
              username: username,
              password: userPassword
            }
            User.create(data).then((newUser, created) => {
              if(!newUser){
                return done(null, false)
              }
              if(newUser){
                return done(null, newUser)
              }
            })
          }
        })
    } )
  )

// Local for signin

  passport.use('local-signin', new LocalStrategy(
    {
      passReqToCallback: true
    },
    (req, username, password, done) => {
      let User = user
      let isValidPassword = (userpass, password) => {
        return bCrypt.compareSync(password, userpass)
      }

      User.findOne({ where: { username: username }})
        .then( user => {
          if (!user) {
            return done(null, false, { message: 'Username does not exists'})
          }
          if (!isValidPassword(user.password, password)){
            return done(null, false, { message: 'Incorrect password'})
          }

          let userInfo = user.get();
          return done(null, userInfo)
        }).catch( err => {
          console.log('Error:', err)

          return done(null, false, {message: 'Something went wrong with your Signin'})
        })
        
    }
  ))
}