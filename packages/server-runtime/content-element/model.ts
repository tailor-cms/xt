import { Model, DataTypes } from "sequelize";
const { BOOLEAN, DATE, DOUBLE, TEXT, STRING, UUID, UUIDV4 } = DataTypes;

export default class ContentElement extends Model {
  static fields() {
    return {
      uid: {
        type: UUID,
        defaultValue: UUIDV4,
        unique: true,
      },
      type: {
        type: STRING
      },
      position: {
        type: DOUBLE,
        validate: { min: 0, max: 1000000 }
      },
      data: {
        type: TEXT,
        get() {
          return JSON.parse(this.getDataValue("data"));
        },
        set(value) {
          this.setDataValue("data", JSON.stringify(value));
        }
      },
      meta: {
        type: TEXT,
        get() {
          return JSON.parse(this.getDataValue("meta"));
        },
        set(value) {
          this.setDataValue("meta", JSON.stringify(value));
        },
        defaultValue: "{}"
      },
      contentId: {
        type: UUID,
        defaultValue: UUIDV4,
        field: 'content_id',
      },
      contentSignature: {
        type: STRING(40),
        validate: { notEmpty: true },
        field: 'content_signature',
      },
      refs: {
        type: TEXT,
        get() {
          return JSON.parse(this.getDataValue("refs"));
        },
        set(value) {
          this.setDataValue("refs", JSON.stringify(value));
        },
        defaultValue: "{}"
      },
      linked: {
        type: BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      detached: {
        type: BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      createdAt: {
        type: DATE,
        field: 'created_at'
      },
      updatedAt: {
        type: DATE,
        field: 'updated_at'
      },
      deletedAt: {
        type: DATE,
        field: 'deleted_at'
      }
    }
  }

  static initOptions() {
    return {
      modelName: 'ContentElement',
      tableName: 'content_element',
      underscored: true,
      timestamps: true,
      paranoid: true
    };
  }
}
