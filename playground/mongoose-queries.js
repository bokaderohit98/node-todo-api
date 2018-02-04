const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '5a76a221b5eafe13bf7f29791';
//
// if (!ObjectID.isValid(id)) {
//   console.log('Id not valid');
// }


// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('Id not found');
//   }
//   console.log('Todo By Id', todo);
// }).catch((err) => {
//   console.log(err);
// })

var id = '5a75ce900d69ed1c16c32b7a';

if (!ObjectID.isValid(id)){
  console.log('Invalid id');
}

User.findById(id).then((user) => {
  if (!user) {
    return console.log('Id not found');
  }
  console.log('User: ', user);
}).catch((err) => {
  console.log(err);
});
