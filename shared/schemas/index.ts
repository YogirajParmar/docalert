import { UserEntity } from "./user.entity";
import { PUC } from "./puc.entity";

UserEntity.hasMany(PUC, { foreignKey: "userId" });
PUC.belongsTo(UserEntity, { foreignKey: "userId" });

export { UserEntity, PUC };
