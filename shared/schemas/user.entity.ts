import { Model, DataTypes, Sequelize } from "sequelize";
import { getSequelize } from "../../server/configs/db";

class UserEntity extends Model {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public password!: string;
  public email!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserEntity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: getSequelize(),
    tableName: "users",
    timestamps: true,
  }
);

export { UserEntity };
