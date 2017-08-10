let config = {
  local: {
    "configPath": "/",
    "port": '3000'
  },
  production: {
    "configPath": "/",
    "port": '8080'
  },
  development: {
    "configPath": "/",
    "port": '8081'
  }
}
let env = process.env.ENV || 'local';
module.exports = config[env];