module.exports = (sequelize, DataTypes) => {
  const Poll = sequelize.define('poll', {
    question: {
      type: DataTypes.STRING,
      allowNull: false
    },
    published: {
      type: DataTypes.STRING,
      allowNull: false
    },
    multiSelect: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  })
  return Poll;
}