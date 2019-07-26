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

const remove = filter =>
  db('users')
    .where(filter)
    .delete();

module.exports = {
  get,
  add,
  remove
};
