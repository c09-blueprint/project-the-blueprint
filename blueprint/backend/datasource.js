import { Sequelize } from "sequelize";
import { config } from 'dotenv';

config();

const dbConfig = {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres'
}

export const sequelize = new Sequelize(dbConfig);
