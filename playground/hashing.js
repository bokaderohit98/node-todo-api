const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

var password = '123abc';
//
// bcryptjs.genSalt(10, (err, salt) => {
//   bcryptjs.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   });
// });

var hashedPassword = '$2a$10$1VY.ScRNmEIdnr49sYcv7eKdDErHWsC25bFgXsxuxWRMGs76MnPNa'

bcryptjs.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});

// var data = {
//   id: 10
// };
//
// var token = jwt.sign(data, 'secret');
// console.log(token);
//
// var decoded = jwt.verify(token, 'secret');
// console.log('Decoded: ', decoded);
// // var message = 'Iam a user ';
// // var hash = SHA256(message).toString();
// //
// // console.log('Message', message);
// // console.log('Hash', hash);
// //
// // var data = {
// //   id: 4,
// // };
// //
// // var token = {
// //   data,
// //   hash: SHA256(JSON.stringify(data) + 'someSecret').toString()
// // };
// //
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
// //
// //
// // var resultHash = SHA256(JSON.stringify(token.data) + 'someSecret').toString();
// //
// // if (resultHash === token.hash) {
// //   console.log('Data was not changed');
// // } else {
// //   console.log('Data was changed');
// // }
