const express = require("express");
const router = express.Router();

const db = require("../config/db");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");


// REGISTER

router.post("/register", async(req,res)=>{


    const {name,email,password} = req.body;


    try{


        const hashedPassword = await bcrypt.hash(password,10);



        const sql = 
        "INSERT INTO users(name,email,password) VALUES(?,?,?)";


        db.query(
            sql,
            [
                name,
                email,
                hashedPassword
            ],

            (err,result)=>{


                if(err){

                    return res.status(500).json({
                        message:"Email already exists"
                    });

                }



                res.json({

                    message:"Register successful"

                });


            }

        );



    }
    catch(error){


        res.status(500).json({

            message:"Server error"

        });


    }


});





// LOGIN

router.post("/login",(req,res)=>{


    const {email,password}=req.body;



    const sql =
    "SELECT * FROM users WHERE email=?";



    db.query(
        sql,
        [email],

        async(err,result)=>{


            if(err)
            {

                return res.status(500).json(err);

            }



            if(result.length===0)
            {

                return res.status(401).json({

                    message:"User not found"

                });

            }



            const user=result[0];



            const checkPassword =
            await bcrypt.compare(
                password,
                user.password
            );



            if(!checkPassword)
            {

                return res.status(401).json({

                    message:"Wrong password"

                });

            }



            const token =
            jwt.sign(

                {
                    id:user.user_id,
                    role:user.role
                },

                "secretkey",

                {
                    expiresIn:"1d"
                }

            );



            res.json({

                message:"Login successful",

                token:token,

                role:user.role

            });



        }

    );



});




module.exports = router;