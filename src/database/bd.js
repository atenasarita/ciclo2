// bd.js usando módulos ES
import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  host: "pg-20116b45-diegovillasana123-ca79.b.aivencloud.com",
  port: 19442,
  database: "defaultdb",
  user: "avnadmin",
  password: "AVNS_1BwJ-SWozteYpDopxee",
  ssl: {
    rejectUnauthorized: false
  }
});
