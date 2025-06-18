const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// الاتصال بالداتابيز
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) throw err;
  console.log('✔️ متصل بقاعدة البيانات');
});

// endpoint لتغيير كلمة السر
app.post('/change-password', (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({ message: 'كل الحقول مطلوبة' });
  }

  // نجيب المستخدم من الداتابيز
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'خطأ في السيرفر' });

    if (results.length === 0) {
      return res.status(404).json({ message: 'المستخدم مش موجود' });
    }

    const user = results[0];

    // نتأكد إن الباسورد القديمة صح
    bcrypt.compare(oldPassword, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: 'حصل خطأ في التحقق' });

      if (!isMatch) {
        return res.status(401).json({ message: 'كلمة السر القديمة غلط' });
      }

      // نعمل hash للباسورد الجديدة
      bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ message: 'حصل خطأ أثناء التشفير' });

        // نحدث الباسورد الجديدة في الداتابيز
        db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email], (err, result) => {
          if (err) return res.status(500).json({ message: 'خطأ أثناء تحديث الباسورد' });

          res.status(200).json({ message: '✔️ Password changed successfully    ' });
        });
      });
    });
  });
});

// تشغيل السيرفر
app.listen(process.env.PORT, () => {
  console.log(`🚀 السيرفر شغال على http://localhost:${process.env.PORT}`);
});
