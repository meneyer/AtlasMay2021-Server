module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    passwordhash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    pollsVotedOn: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true
    },
  })
  return User;
}