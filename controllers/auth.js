const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../db/connectDB");

exports.signup = async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.connection.query(
    `select * from users where email='${email}' `,
    (err, results, feilds) => {
      if (err) {
        console.log("Error", err);
        return res.json({
          message: "Error In Connection Contact To Administartor",
        });
      }
      if (results.length > 0) {
        return res.json({
          message: "User Already Exist",
        });
      } else {
        db.connection.query(
          `INSERT INTO attendence.users (name, email, password) VALUES ('${name}', '${email}', '${hashedPassword}');`,
          (err, results) => {
            if (err) {
              console.log("Error ", err);
              return res.json({
                message: "Error In Connection Contact To Administartor",
              });
            }
            console.log(results);
            return res.json({
              message: "Signup Success",
            });
          }
        );
      }
    }
  );
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  await db.connection.query(
    `select * from users where email='${email}' `,
    async (err, results, feilds) => {
      if (err) {
        console.log("Error", err);
        return res.json({
          message: "Error In Connection Contact To Administartor",
        });
      }
      if (results.length > 0) {
        console.log(
          await bcrypt.compare(req.body.password, results[0].password)
        );
        if (await bcrypt.compare(req.body.password, results[0].password)) {
          const accsessToken = jwt.sign(
            { email: email },
            process.env.JWT_ACC_ACTIVATE
          );
          return res.json({
            asscessToken: accsessToken,
            user: results[0],
            message: "Matched",
          });
        } else {
          return res.json({ message: "Email and Password Not Matched" });
        }
      } else {
        return res.json({ message: "Email and Password Not Matched" });
      }
    }
  );
};
