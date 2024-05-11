const yup = require('yup');

const moveRequestSchema = yup.object({
    uuid: yup.string(),
    UserID: yup.string().uuid().required(),
    moveStatus: yup.string().required(),
    moveDate: yup.date().required(),
    moveTime: yup.string().required(),
    moveFrom: yup.string().required(),
    moveTo: yup.string().required(),
})

const updateMoveRequestSchema = yup.lazy((value) =>
    yup.object().shape({
    UserID: yup.string(),
    moveStatus: yup.string(),
    moveDate: yup.date(),
    moveTime: yup.string(),
    moveFrom: yup.string(),
    moveTo: yup.string()
    }).test({
        name: 'at-least-one-field',
        exclusive: true,
        message: 'At least one of the following fields is required: UserID, moveStatus, moveDate, moveTime, moveFrom, moveTo',
        test: (obj) => 
            Object.keys(obj).some(
                (key) =>
                    key === 'UserID' ||
                    key === 'moveStatus' ||
                    key === 'moveDate' ||
                    key === 'moveTime' ||
                    key === 'moveFrom' ||
                    key === 'moveTo'
            ),
})
);

const moveRequestPostValidation = async (req, res, next) => {
    try {
        await moveRequestSchema.validate(req.body);
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const validateUpdateMoveRequest = async (req, res, next) => {
    try {
        await updateMoveRequestSchema.validate(req.body);
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

}

module.exports = {
    moveRequestPostValidation,
    validateUpdateMoveRequest
}