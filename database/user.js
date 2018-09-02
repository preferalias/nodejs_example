const bcrypt = require('bcrypt-nodejs')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    } 
  },
  {
    classMethods: {
      validPassword: (password, passwd, done, user) => {
        bcrypt.compare(password, passwd, (err, isMatch) => {
          if(err) console.log(err)
          if(isMatch){
            return done(null, user)
          } else {
            return done(null, false)
          }
        })
      }
    }
  })

  User.beforeCreate((user, options) => {
    return cryptPassword(user.password)
      .then(success => {
        user.password = success
      })
      .catch(err => {
        if (err) console.log(err)
      })
  })

  const cryptPassword = password => {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        if(err) return reject(err)

        bcrypt.hash(password, salt, null, (err, hash) => {
          if (err) return reject(err)
          return resolve(hash)
        })
      })
    })
  }
  return User;
}
