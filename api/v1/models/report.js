'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Report.init({
    reportTypeId: DataTypes.INTEGER,
    email: DataTypes.STRING,
    streetNumber: DataTypes.INTEGER,
    streetName: DataTypes.STRING,
    zipCode: DataTypes.INTEGER,
    neighborhood: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    location: DataTypes.JSONB,
    locationType: DataTypes.STRING,
    images: DataTypes.JSON,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Report',
  });
  return Report;
};