const yup = require('yup');

const usersSchema = yup.object({
    uuid: yup.string().uuid(),
    username: yup.string().required(),
    password: yup.string().required(),
    email: yup.string().email().required(),
    firstName: yup.string().required(),
    lastName: yup.string(),
    phoneNumber: yup.string().required(),
    PhotoUrl: yup.string().url(),
})

const loginSchema = yup.object({
    username: yup.string().required(),
    password: yup.string().required(),
})

const usersProfileEditSchema = yup.lazy((value) =>
    yup.object().shape({
        username: yup.string(),
        email: yup.string().email(),
        firstName: yup.string(),
        lastName: yup.string(),
        phoneNumber: yup.string(),
        PhotoUrl: yup.string().url(),
    }).test({
        name: 'at-least-one-field',
        exclusive: true,
        message: 'At least one of the following fields is required: username, email, firstName, lastName, phoneNumber, PhotoUrl',
        test: (obj) =>
            Object.keys(obj).some(
                (key) =>
                    key === 'username' ||
                    key === 'email' ||
                    key === 'firstName' ||
                    key === 'lastName' ||
                    key === 'phoneNumber' ||
                    key === 'PhotoUrl'
            ),
    }));


const usersEditProfileValidation = async (req, res, next) => {
    try {
        await usersProfileEditSchema.validate(req.body);
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

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
    usersLoginValidation,
    usersEditProfileValidation
}