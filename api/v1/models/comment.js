'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Comment.init(
    {
      author: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      objectType: DataTypes.STRING,
      objectId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Comment',
    }
  )
  return Comment
}
