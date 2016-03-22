module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ToDo', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      // stored as ints represeting unix time to work with sqlite
      type: DataTypes.INTEGER,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'ToDo',
    freezeTableName: true
  });
};