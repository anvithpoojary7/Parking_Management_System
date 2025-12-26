const express=require('express');
const router=express.Router();
const pool=require('../config/db');
const verifyFirebaseToken=require('../middleware/auth');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');

const dotenv=require('dotenv');
require('dotenv').config();

const JWT_SECRET=process.env.JWT_SECRET;


router.post('/signup',verifyFirebaseToken,async(req,res) =>{
       const {uid,email,name}=req.user;

       try{
          const checkUser=await pool.query('SELECT * FROM users WHERE email=$1',[email]);

          if(checkUser.rows.length == 0){
              await pool.query(
                  'INSERT INTO users (firbase_uid,full_name,email) VALUES ($1,$2,$3)',
                  [uid,name,email]

              );
              res.status(200).json({message: " google signup sucessful",user:{email,name}})

          }

       }
       catch(err){
            console.log("error in google signup",err);
            res.status(500).json({message:"server error",error:err.message});
       }
})

router.post('/manual-signup', async (req, res) => {
  const { fullName, email, password, confirmPassword, phone } = req.body;

  if (!fullName || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "Please fill all required fields." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users(full_name, email, password_hash, phone)
       VALUES ($1, $2, $3, $4) RETURNING user_id, email, full_name`,
      [fullName, email, hashedPassword, phone || null]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.user_id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({ message: "Signup successful", user });
  } catch (err) {
    console.error("Manual signup error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});




module.exports=router;
