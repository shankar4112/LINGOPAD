import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

/**
 * Translation Model
 * Represents a translation record stored in the database
 * Compatible with both SQLite and PostgreSQL
 */
const Translation = sequelize.define(
  'Translation',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    inputText: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'input_text',
      validate: {
        notEmpty: true,
        len: [1, 5000]
      }
    },
    translatedText: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'translated_text',
      validate: {
        notEmpty: true,
        len: [1, 5000]
      }
    },
    pronunciation: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'pronunciation'
    },
    sourceLanguage: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'english',
      field: 'source_language'
    },
    targetLanguage: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'target_language',
      validate: {
        notEmpty: true
      }
    },
    translationMethod: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'nllb',
      field: 'translation_method',
      validate: {
        isIn: [['nllb', 'aws', 'huggingface', 'mock']]
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    }
  },
  {
    tableName: 'translations',
    timestamps: false,
    underscored: true,
    createdAt: 'created_at'
  }
);

export default Translation;
