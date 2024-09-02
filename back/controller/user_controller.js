const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { updatePhoto, deletePhoto, uploadPhoto } = require('./photo_controller')
const User  = require('../models/index').Users
dotenv = require('dotenv')
dotenv.config()

const getUser = async (req, res) => {
	const uuid = req.userId;
	try {
		const user = await User.findOne({ where: { uuid }, attributes: { exclude: ['password', 'salt', 'token', 'token_exp'] }});
		if (user) {
			res.status(200).json({ message: "User found", user: user });
            console.log(user);
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

const getUserById = async (req, res) => {
    const uuid = req.params.uuid; // Extract uuid from route parameters
    try {
        const user = await User.findOne({
            where: { uuid },
            attributes: { exclude: ['password', 'salt', 'token', 'token_exp'] }
        });

        if (user) {
            res.status(200).json({ message: "User found", user });
            console.log(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}


const register = async (req, res) => {
    const { username, email, password, firstName, lastName, phoneNumber } = req.body;
    let PhotoUrl = null;
    try {
		checkUserName = await User.findOne({ where: { username } });
		if (checkUserName) {
			res.status(409).json({ message: "Username already exists" });
			return;
		}

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("req.file: ", req.file);
        if(req.file){
            console.log("im here");
            PhotoUrl = await uploadPhoto(req.file);
        }
        const user = await User.create({
            username: username,
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            PhotoUrl: PhotoUrl,
            salt: salt,
            token: "",
            token_exp: new Date(Date.now() + 604800000) // Use new Date() to create a date object
        });
        
        if (user) {
            console.log("user: ", user);
            res.status(201).json({ message: "User Created Successfully", user: user });
            console.log("res", res);
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

//should replace later with an overload update not just photo
const uploadProfilePhoto = async (req, res) => {
    const uuid = req.userId;
    let PhotoUrl = '';
    try{
    if (req.file) {
        const user = await User.findOne({ where: { uuid } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        else if (user.PhotoUrl !== '' || user.PhotoUrl !== null) {
           PhotoUrl = await updatePhoto(req.file ,user.PhotoUrl);
        }
        else {
            PhotoUrl = await uploadPhoto(req.file);
        }
      }
    const [affectedRows, updatedRows] = await User.update(
        { PhotoUrl },{ where: { uuid }, returning: true });
        if(affectedRows > 0){
            res.status(201).json({message: 'Profile Photo uploaded successfully', user: updatedRows[0]});
        }
        else{
            res.status(500).json({message: 'Failed to upload Profile Photo'});
        }
    }
    catch(error){
        res.status(500).json({message: "Internal Server Error", error: error.message})
    }
}

const deleteProfilePhoto = async (req, res) => {
    const uuid = req.userId;
    try {
        const user = await User.findOne({ where: { uuid } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        else if (user.PhotoUrl !== '' || user.PhotoUrl !== null) {
            console.log(user.PhotoUrl);
           await deletePhoto(user.PhotoUrl);
        }
        else {
            return res.status(409).json({ message: 'No Profile Photo found' });
        }
        const [affectedRows, updatedRows] = await User.update(
            { PhotoUrl: null },{ where: { uuid }, returning: true });
            if(affectedRows > 0){
                res.status(200).json({message: 'Profile Photo deleted successfully', user: updatedRows[0]});
            }
            else{
                res.status(500).json({message: 'Failed to delete Profile Photo'});
                console.log(error.message);
            }
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
        console.log(error.message);
    }
}

const editProfile = async (req, res) => {
    const uuid = req.userId;
    const { email, firstName, lastName, phoneNumber } = req.body;

    try {
        const user = await User.findOne({ where: { uuid } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const [affectedRows, updatedRows] = await User.update(
            { email, firstName, lastName, phoneNumber },
            { where: { uuid }, returning: true }
        );

        if (affectedRows > 0) {
            // Exclude sensitive fields
            const updatedUser = updatedRows[0].get({ plain: true });
            delete updatedUser.password;
            delete updatedUser.salt;
            delete updatedUser.token;
            delete updatedUser.token_exp;

            res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
        } else {
            res.status(500).json({ message: 'Failed to update Profile' });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
module.exports = {
    register,
    login,
	getUser,
    getUserById,
    uploadProfilePhoto,
    deleteProfilePhoto,
    editProfile
}
