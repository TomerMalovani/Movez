const yup = require('yup');

const usersSchema = yup.object({
    uuid: yup.string().uuid(),
    username: yup.string().required(),
    password: yup.string().required(),
    email: yup.string().email().required(),
    firstName: yup.string(),
    lastName: yup.string(),
    phoneNumber: yup.string(),
    address: yup.string(),
    city: yup.string(),
    state: yup.string(),
    zip: yup.string(),
    PhotoUrl: yup.string().url(),
})

const loginSchema = yup.object({
    username: yup.string().required(),
    password: yup.string().required(),
})

const usersRegisterValidation = async (req, res, next) => {
    try {
        await usersSchema.validate(req.body);
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const usersLoginValidation = async (req, res, next) => {
    try {
        await loginSchema.validate(req.body);
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    usersRegisterValidation,
    usersLoginValidation
}