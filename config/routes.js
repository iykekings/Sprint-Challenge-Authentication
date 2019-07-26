const axios = require('axios');
const bcrypt = require('bcryptjs');
const Users = require('../database/helper');

const { authenticate } = require('../auth/authenticate');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

async function register(req, res) {
  try {
    const salt = bcrypt.genSaltSync(10);
    const user = req.body;
    user.password = bcrypt.hashSync(req.body.password, salt);
    const newUser = await Users.add(user);
    if (newUser) {
      res.status(201).json(newUser);
    } else {
      res.status(404).json({ message: 'Error retrieving the user' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Could not create the user' });
  }
}

function login(req, res) {
  // implement user login
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
