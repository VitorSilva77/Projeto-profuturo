// src/main/database/connection.js

const knex = require('knex');
let dbInstance;

function init() {
  if (dbInstance) {
    return; // Já foi inicializado
  }
  
  console.log('Inicializando conexão com o banco de dados...');
  dbInstance = knex({
    client: 'pg', // Mude para 'mysql2', 'mssql', etc.
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      // ssl: { rejectUnauthorized: false } // Descomente se necessário
    },
    pool: { min: 2, max: 10 }
  });

  // Testa a conexão
  dbInstance.raw('SELECT 1')
    .then(() => console.log('Conexão com o banco de dados estabelecida com sucesso.'))
    .catch((err) => {
      console.error('Falha ao conectar ao banco de dados:', err);
      process.exit(1); // Fecha a aplicação se não conseguir conectar
    });
}

function getDb() {
  if (!dbInstance) {
    throw new Error('A conexão com o banco de dados não foi inicializada. Chame init() primeiro.');
  }
  return dbInstance;
}

module.exports = { init, getDb };