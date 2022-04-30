const AppError = require('../Utils/AppError');
const catchAsync = require('../Utils/CatchAsync')
const User = require('./../Model/userModel')
const factory = require('./HandleFactory')

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
  };

exports.getUser = factory.getOne(User);