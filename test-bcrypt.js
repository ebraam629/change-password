const bcrypt = require('bcryptjs');

const hashedPassword = '$2a$10$CwTycUXWue0Thq9StjUM0uJ8j1zG9K1TnYTXh6P4d8XbRZ6xGkRHy'; // خذ من قاعدة البيانات
const inputPassword = '123456'; // جرب الباسورد القديم

bcrypt.compare(inputPassword, hashedPassword, (err, isMatch) => {
  if (err) throw err;
  if (isMatch) {
    console.log('✔️ الباسوورد صحيح');
  } else {
    console.log('❌ الباسوورد غلط');
  }
});
