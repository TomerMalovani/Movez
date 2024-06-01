const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User  = require('../models/index').Users
dotenv = require('dotenv')
dotenv.config()

const getUser = async (req, res) => {
	const uuid = req.userId;
	try {
		const user = await User.findOne({ where: { uuid }, attributes: { exclude: ['password', 'salt', 'token', 'token_exp'] }});
		if (user) {
			res.status(200).json({ message: "User found", user: user });
		}
		else {
			res.status(404).json({ message: "User not found" });
		}
	}
	catch (error) {
		console.log(error);
		res.status(500).json({ message: "Internal Server Error", error: error.message });
	}
}

const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            username: username,
            email: email,
            password: hashedPassword,
            salt: salt,
            token: "",
            token_exp: new Date(Date.now() + 604800000) // Use new Date() to create a date object
        });
        
        if (user) {
            res.status(201).json({ message: "User Created Successfully", user: user });
        } else {
            res.status(500).json({ message: "Failed to create User" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const login = async(req,res)=>{
    const {username, password} = req.body
   
    try{
        const user = await User.findOne({where: {username}})
        if(user){
            // salt hash
            const isMatch = await bcrypt.compare(password, user.password)
            if(isMatch){
                const {uuid,username} = user
                const token = jwt.sign({uuid:uuid,username:username  }, process.env.JWT_SECRET, {expiresIn: '7d'})
                await user.update({ token: token, token_exp: Date.now() + 604800000 });
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
    login,
	getUser
}
