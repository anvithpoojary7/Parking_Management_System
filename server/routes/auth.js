const express = require('express');
const verifyFirebaseToken = require('../middleware/auth');
const pool = require('../config/db');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const router = express.Router();
const dotenv=require('dotenv');

require('dotenv').config();

const JWT_SECRET=process.env.JWT_SECRET;

router.post('/manual-login',async(req,res) =>{
            
          const { email,password} =req.body;
          try{
              
            const result=await pool.query( ' SELECT * FROM users WHERE email = $1',[email]);

            if(result.rows.length === 0){
               return res.status(400).json({message : 'user not found'});

            }

            const user=result.rows[0];

            const isMatch=await bcrypt.compare(password,user.password_hash);

            if(!isMatch){
              return res.status(401).json({message : 'invalid password'});



            }
            const token=jwt.sign(
              { id :user.id,email:user.email,name: user.full_name},
              JWT_SECRET,{expiresIn: '1d'}
            );
            
            res.status(200).json({
      message: 'Login successful',
      user: {
        name: user.full_name,
        email: user.email
      },
      token   
    });
          }catch(err){
             console.error('Login error:', err);
            res.status(500).json({ message: 'Server error' });
          }


})

router.post('/login', verifyFirebaseToken, async (req, res) => {
  const { uid, email, name } = req.user;

  try {
    // Ensure user exists or insert new
    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING`,
      [name || 'Google User', email, 'google_oauth'] 
    );

    // If user was just inserted, result.rows[0] exists
    // If user already existed, fetch them
    let user = result.rows[0];
    if (!user) {
      const existing = await pool.query(`SELECT user_id, full_name, email FROM users WHERE email = $1`, [email]);
      user = existing.rows[0];
    }

    // ✅ Generate JWT
    const token = jwt.sign(
      { id: user.user_id, email: user.email, name: user.full_name },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Send user + token in response
    res.status(200).json({
      message: "Google login successful",
      user: {
        name: user.full_name,
        email: user.email
      },
      token
    });

  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ message: "DB error", error: err.message });
  }
});


module.exports = router;
