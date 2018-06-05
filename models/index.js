'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(__filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];
var db        = {};
const mongoose = require('mongoose')

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  if (config.dialect === 'sqlite') {
    var sequelize = new Sequelize(config.database, config.username, config.password, config);
  } else {
    var sequelize = new Sequelize(config.database, config.username, config.password, config);
  }
  
}

const mongooseModelNames = ["accout", "destination", "index", "note", "user"]
const sequelizeModelNames = ["location"]

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    //check mogoose model or sequelize model
    const fileNameWithoutExt = file.split(".")[0]

    if (sequelizeModelNames.includes(fileNameWithoutExt)) {
      let model = sequelize['import'](path.join(__dirname, file));
      db[model.name] = model;
    } else {
      let model = require(path.join(__dirname, file))(mongoose)
      db[model.modelName] = model
    }
  })


Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
})


//mongoose connection
mongoose.Promise = Promise;
const mongoUri = config.mongo.url
mongoose.connect(mongoUri, { server: { socketOptions: { keepAlive: 1 } } })
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`)
})

db.mongoose = mongoose
db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
