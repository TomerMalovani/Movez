const { col } = require('sequelize');
const yup = require('yup');

const photoSchema = yup.object({
    uuid: yup.string().required(),
    PhotoUrl: yup.string().url().required()
});

const photoValidation = async (req, res, next) => {
    try {
        await photoSchema.validate(req.body);
        next();
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    photoValidation
}