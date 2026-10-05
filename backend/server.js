const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const db = require('./db');
const { validarContato } = require('./validacao');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const sql = {
  listar: db.prepare('SELECT * FROM contatos ORDER BY nome COLLATE NOCASE'),
  buscar: db.prepare(`
    SELECT * FROM contatos
    WHERE nome LIKE @q OR telefone LIKE @q OR email LIKE @q
    ORDER BY nome COLLATE NOCASE
  `),
  porId: db.prepare('SELECT * FROM contatos WHERE id = ?'),
  inserir: db.prepare(`
    INSERT INTO contatos (nome, telefone, email, aniversario, redes, observacoes)
    VALUES (@nome, @telefone, @email, @aniversario, @redes, @observacoes)
  `),
  atualizar: db.prepare(`
    UPDATE contatos SET nome=@nome, telefone=@telefone, email=@email,
      aniversario=@aniversario, redes=@redes, observacoes=@observacoes
    WHERE id=@id
  `),
  remover: db.prepare('DELETE FROM contatos WHERE id = ?'),
};

const idValido = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ erro: 'ID inválido' });
  }
  req.id = id;
  next();
};

app.get('/contatos', (req, res) => {
  const q = (req.query.q || '').toString().trim();
  res.json(q ? sql.buscar.all({ q: `%${q}%` }) : sql.listar.all());
});

app.get('/contatos/:id', idValido, (req, res) => {
  const contato = sql.porId.get(req.id);
  if (!contato) return res.status(404).json({ erro: 'Contato não encontrado' });
  res.json(contato);
});

app.post('/contatos', (req, res) => {
  const { erros, dados } = validarContato(req.body);
  if (erros) return res.status(400).json({ erro: 'Erro de validação', campos: erros });
  const { lastInsertRowid } = sql.inserir.run(dados);
  res.status(201).json(sql.porId.get(lastInsertRowid));
});

app.put('/contatos/:id', idValido, (req, res) => {
  if (!sql.porId.get(req.id)) return res.status(404).json({ erro: 'Contato não encontrado' });
  const { erros, dados } = validarContato(req.body);
  if (erros) return res.status(400).json({ erro: 'Erro de validação', campos: erros });
  sql.atualizar.run({ ...dados, id: req.id });
  res.json(sql.porId.get(req.id));
});

app.delete('/contatos/:id', idValido, (req, res) => {
  const { changes } = sql.remover.run(req.id);
  if (!changes) return res.status(404).json({ erro: 'Contato não encontrado' });
  res.status(204).end();
});

const pastaFront = path.join(__dirname, '..', 'dist', 'indexa', 'browser');
if (fs.existsSync(pastaFront)) {
  app.use(express.static(pastaFront));
  app.get('*', (req, res) => res.sendFile(path.join(pastaFront, 'index.html')));
}

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ erro: 'JSON inválido' });
  console.error(err);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

app.listen(PORT, () => console.log(`API do Indexa rodando em http://localhost:${PORT}`));