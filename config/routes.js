const axios = require('axios');
const bcrypt = require('bcryptjs');
const Users = require('../database/helper');
const jwt = require('jsonwebtoken');

const { authenticate } = require('../auth/authenticate');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

async function register(req, res) {
  const { username, password } = req.body;
  try {
    if (username && password) {
      const salt = bcrypt.genSaltSync(10);
      const user = req.body;
      user.password = bcrypt.hashSync(req.body.password, salt);
      const newUser = await Users.add(user);
      if (newUser) {
        res.status(201).json(newUser);
      } else {
        res.status(404).json({ message: 'Error retrieving the user' });
      }
    } else {
      res.status(400).json({ message: 'Please provide username and password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Could not create the user' });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;
    const user = await Users.get({ username });
    const isUser = bcrypt.compareSync(password, user.password);
    if (isUser) {
      const token = genToken(user);
      res.status(200).json({ message: `Welcome ${username}`, token });
    }
  } catch (error) {
    res.status(500).json('Could not loggin');
  }
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' }
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}

function genToken(user) {
  const payload = {
    sub: user.id,
    username: user.username
  };

  const options = {
    expiresIn: '1day'
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
}
