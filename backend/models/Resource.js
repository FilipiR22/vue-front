import { DataTypes } from "sequelize";

export default (sequelize) => {
    const Resource = sequelize.define(
        "Resource",
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            titulo: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            autor: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            data: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM("ativo", "inativo"),
                allowNull: false,
                defaultValue: "ativo",
            },
            userId: {
                type: Sequelize.UUID,
                references: { model: "users", key: "id" },
                onDelete: "SET NULL"
            }
        },
        {
            tableName: "resources",
            timestamps: false,
        }
    );

    return Resource;
};

User.hasMany(Resource, { foreignKey: "userId" });
Resource.belongsTo(User, { foreignKey: "userId" });