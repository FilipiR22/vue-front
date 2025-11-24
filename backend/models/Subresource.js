import { DataTypes } from "sequelize";

export default (sequelize) => {
    const Subresource = sequelize.define(
        "Subresource",
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            resourceId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            titulo: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            conteudo: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            likes: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
        },
        {
            tableName: "subresources",
            timestamps: false,
        }
    );

    return Subresource;
};
