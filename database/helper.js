const db = require('./dbConfig');

const get = filter =>
  !filter
    ? db('users')
    : db('users')
        .where(filter)
        .first();

const add = user =>
  db('users')
    .insert(user)
    .then(([id]) => (!id ? null : get({ id })));

module.exports = {
  get,
  add
};
