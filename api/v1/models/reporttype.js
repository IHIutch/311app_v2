'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReportType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ReportType.init({
    name: DataTypes.STRING,
    group: DataTypes.STRING,
    department: DataTypes.STRING,
    markerColor: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ReportType',
  });
  return ReportType;
};