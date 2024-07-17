const express = require('express')
const exphbs = require('express-handlebars')
const pool = require('./db/conn')

console.log(pool)

const app = express()

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.use(
  express.urlencoded({
    extended: true,
  }),
)

app.use(express.json())

// ROTAS

app.get('/', function(req, res) {
    res.render('home')
})

app.post('/users/insertuser', function (req, res) {
  const nome = req.body.nome
  const idade = req.body.idade
  const cpf = req.body.cpf

  const query = `INSERT INTO users (nome, idade, cpf) VALUES ('${nome}', ${idade}, '${cpf}')`

  pool.query(query, function(err){
    if (err) {
      console.log(err)
    }

    res.redirect('/')
  })
})

app.get('/users', function (req, res) {
  const query = `SELECT * FROM users`

  pool.query(query, function (err, data) {
    if (err) {
      console.log(err)
    }

    const users = data

    res.render('users', { users })
  })
})

app.get('/users/:id', function (req, res) {
  const id = req.params.id

  const query = `SELECT * FROM users WHERE id = ${id}`

  pool.query(query, function (err, data) {
    if(err) {
      console.log(err)
    }

    const user = data[0]

    res.render('user', { user })
  })
})

app.get('/users/edit/:id', function (req, res) {
  const id = req.params.id

  const query = `SELECT * FROM users WHERE id = ${id}`

  pool.query(query, function (err, data) {
    if(err) {
      console.log(err)
    }

    const user = data[0]

    res.render('edituser', { user })
  })
})

app.post('/users/updateuser', function (req, res) {
  const id = req.body.id
  const nome = req.body.nome
  const idade = req.body.idade
  const cpf = req.body.cpf

  const query = `UPDATE users SET nome = '${nome}', idade = ${idade}, cpf = '${cpf}' WHERE id = ${id}`

  pool.query(query, function (err) {
    if (err) {
      console.log(err)
    }

    res.redirect(`/users/edit/${id}`)
  })
})

app.post('/users/remove/:id', function(req, res) {
  const id = req.params.id

  const query = `DELETE FROM users WHERE id = ${id}`

  pool.query(query, function (err) {
    if (err) {
      console.log(err)
    }

    res.redirect(`/users`)
  })
})

// CONEXÃO

app.listen(3000)