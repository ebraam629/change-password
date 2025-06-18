const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

// اتصال بقاعدة البيانات
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Bero2512@',       // ← غيرها على حسب جهازك
  database: 'change_app'         // ← غيرها لاسم قاعدة بياناتك
});

const email = 'test@example.com';
const password = '123456'; // ← الباسورد اللي هنجرب بيها

bcrypt.hash(password, 10, (err, hashedPassword) => {
  if (err) throw err;

  const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
  db.query(query, [email, hashedPassword], (err, result) => {
    if (err) throw err;
    console.log('✔️ يوزر اتضاف بنجاح');
    db.end();
  });
});
