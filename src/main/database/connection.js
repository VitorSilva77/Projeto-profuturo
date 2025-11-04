const knex = require('knex');
const path = require('path');
const fs = require('fs');

let dbInstance;

function init() {
  if (dbInstance) {
    return; 
  }

  console.log('Inicializando conexão com o banco de dados...');

  const caPath = path.join(__dirname, 'ssl', 'server-ca.pem');

  dbInstance = knex({
    client: 'mysql2', 
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      //ssl: { ca: fs.readFileSync(caPath) }, // descomentar se for executar em nuvem com SSL
    },

    pool: { min: 2, max: 10 }
  });

  dbInstance.raw('SELECT 1')
    .then(() => console.log('Conexão com o banco de dados estabelecida com sucesso.'))
    .catch((err) => {
      console.error('Falha ao conectar ao banco de dados:', err);
      process.exit(1); 
    });
}

function getDb() {
  if (!dbInstance) {
    throw new Error('A conexão com o banco de dados não foi inicializada. Chame init() primeiro.');
  }
  return dbInstance;
}

module.exports = { init, getDb };