module.exports = (sequelize, DataTypes) => {
  const Option = sequelize.define('option', {
    text: {
      type: DataTypes.STRING,
      allowNull: false
    },
    votes: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  })
  return Option;
}