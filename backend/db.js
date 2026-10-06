const { DatabaseSync } = require('node:sqlite');  
const path = require('path');
const fs = require('fs');

const db = new DatabaseSync(path.join(__dirname, 'agenda.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS contatos (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nome        TEXT NOT NULL,
    telefone    TEXT NOT NULL,
    email       TEXT NOT NULL,
    aniversario TEXT NOT NULL DEFAULT '',
    redes       TEXT NOT NULL DEFAULT '',
    observacoes TEXT NOT NULL DEFAULT ''
  )
`);

const { total } = db.prepare('SELECT COUNT(*) AS total FROM contatos').get();
const jsonAntigo = path.join(__dirname, 'db.json');

if (total === 0 && fs.existsSync(jsonAntigo)) {
  const { contatos = [] } = JSON.parse(fs.readFileSync(jsonAntigo, 'utf8'));
  const inserir = db.prepare(`
    INSERT INTO contatos (nome, telefone, email, aniversario, redes, observacoes)
    VALUES (@nome, @telefone, @email, @aniversario, @redes, @observacoes)
  `);

  db.exec('BEGIN');
  try {
    for (const c of contatos) {
      inserir.run({
        nome: c.nome,
        telefone: c.telefone,
        email: c.email,
        aniversario: c.aniversario || '',
        redes: c.redes || '',
        observacoes: c.observacoes || c.oberservacoes || '',
      });
    }
    db.exec('COMMIT');
  } catch (erro) {
    db.exec('ROLLBACK');
    throw erro;
  }
  console.log(`Importados ${contatos.length} contatos do db.json`);
}

module.exports = db;