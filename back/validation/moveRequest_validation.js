const yup = require('yup');

const moveRequestSchema = yup.object({
    uuid: yup.string(),
    UserID: yup.string().uuid().required(),
    moveStatus: yup.string().required(),
    moveDate: yup.date().required(),
    moveTime: yup.string().required(),
    moveFromCoor:  yup.object().shape({
        type:yup.string().required(),
        coordinates:yup.array().of(yup.number())
    }),
    moveToCoor: yup.object().shape({
        type:yup.string().required(),
        coordinates:yup.array().of(yup.number())
    }),
    fromAddress: yup.string().required(),
    toAddress: yup.string().required(),

})

const updateMoveRequestSchema = yup.lazy((value) =>
    yup.object().shape({
    UserID: yup.string(),
    moveStatus: yup.string(),
    moveDate: yup.date(),
    moveTime: yup.string(),
    moveFromCoor:  yup.object().shape({
        type:yup.string().required(),
        coordinates:yup.array().of(yup.number())
    }),
    moveToCoor: yup.object().shape({
        type:yup.string().required(),
        coordinates:yup.array().of(yup.number())
    }),
    fromAddress: yup.string().required(),
    toAddress: yup.string().required()
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
                    key === 'moveFromCoor' ||
                    key === 'moveToCoor' ||
                    key === 'fromAddress' ||
                    key === 'toAddress'
            ),
})
);

const moveRequestPostValidation = async (req, res, next) => {
    try {
        const {userId} = req
        req.body.UserID = userId
        console.log(req.body)
        if(req.headers['content-type'].includes('multipart/form-data')){
            req.body.moveFromCoor = JSON.parse(req.body.moveFromCoor);
            req.body.moveToCoor = JSON.parse(req.body.moveToCoor);
        }
        await moveRequestSchema.validate(req.body);
        next();
    } catch (error) {
        console.log(error.message)
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