'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class link extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.kriteria, {
        foreignKey: 'kriteria_id',
        as: 'kriteria',
      });
      this.belongsTo(models.teacher, {
        foreignKey: 'teacher_id',
        as: 'teacher',
      });
    }

    static async getAll(where = []) {
      const exclude = ['password', 'createdAt', 'updatedAt'];
      return await this.findAll({
        where,
        include: [
          {
            model: sequelize.models.kriteria,
            as: 'kriteria',
            attributes: { exclude },
          },
          {
            model: sequelize.models.teacher,
            as: 'teacher',
            attributes: { exclude },
          },
        ],
        attributes: { exclude },
        order: [['id', 'ASC']],
        // group: ["teacher_id"],
      })
        .then(result => result)
        .catch(err => {
          console.log(err);
          return err;
        });
    }
  }
  link.init(
    {
      kriteria_id: DataTypes.INTEGER,
      teacher_id: DataTypes.INTEGER,
      value: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'link',
    }
  );
  return link;
};
