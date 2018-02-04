const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//   console.log(result);
// }).catch((err) => {
//   console.log(err);
// });
//
Todo.findOneAndRemove({
  text: 'Paint House'
}).then((result) => {
  console.log('findOneAndRemove: ', result);
}).catch((err) => {
  console.log(err);
});
//
// Todo.findByIdAndRemove('5a7710948978ff00146193b9').then((todo) => {
//   console.log(todo);
// }).catch((err) => {
//   console.log(err);
// });
