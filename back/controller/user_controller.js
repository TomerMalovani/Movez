const pool = require("../db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
dotenv = require('dotenv')
dotenv.config()
const register = async(req,res)=>{

    const {username, email, password} = req.body
    try{
        if(!username || !email || !password){
            return res.status(400).json({message: "Missing required parameters"})
        }
        // create jwt token
        const token = jwt.sign({username}, process.env.JWT_SECRET, {expiresIn: '7d'})

        salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const result = await pool.query(
            `INSERT INTO Users 
            (Username, Email, Password,salt,token,token_exp)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`, 
             [username, email, hashedPassword,salt,token,Date.now()+604800000])
        if(result.rowCount > 0){
            res.status(201).json({message: "User Created Successfully", user: result.rows[0]})
        }
        else{
            res.status(500).json({message: "Failed to create User"})
        }
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Internal Server Error", error: error.message})
    }
}

const login = async(req,res)=>{
    const {username, password} = req.body
    console.log("cehe")
    try{
        if(!username || !password){
            return res.status(400).json({message: "Missing required parameters"})
        }

        const result = await pool.query(
            `SELECT * FROM Users WHERE Username = $1`, 
            [username])
        if(result.rowCount > 0){
            const user = result.rows[0]
            console.log(user)
            // salt hash
            const saltedPassword = bcrypt.hashSync(user.password, user.salt)
            const isMatch = await bcrypt.compare(password, user.password)
            if(isMatch){
                const token = jwt.sign({username}, process.env.JWT_SECRET, {expiresIn: '7d'})
                await pool.query(
                    `UPDATE Users SET token = $1, token_exp = $2 WHERE user_id = $3`, 
                    [token, Date.now()+604800000, user.user_id])
                res.status(200).json({message: "Login Successful", user: user})

            }
            else{
                res.status(401).json({message: "Invalid Credentials"})

            }
        }
        else{
            res.status(404).json({message: "User not found"})
        }
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Internal Server Error", error: error.message})
    }
}

module.exports = {
    register,
    login
}
