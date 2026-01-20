import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

// Define Job model - similar to CREATE TABLE in MySQL
const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  // Job basic info
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  company: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  jobUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    unique: true, // Prevent duplicate job postings
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  // Job details
  employmentType: {
    type: DataTypes.STRING, // Full-time, Part-time, Contract, etc.
    allowNull: true,
  },

  experienceLevel: {
    type: DataTypes.STRING, // Entry, Mid, Senior, etc.
    allowNull: true,
  },

  salary: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // Email metadata
  emailDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  emailSubject: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // User interactions
  isFavorite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  isApplied: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  isRejected: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  // Raw data for debugging
  rawEmailBody: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'jobs',
  timestamps: true, // Creates createdAt and updatedAt
  indexes: [
    {
      fields: ['company'], // Index for faster searching by company
    },
    {
      fields: ['location'],
    },
    {
      fields: ['isFavorite'],
    },
  ],
});

export default Job;
