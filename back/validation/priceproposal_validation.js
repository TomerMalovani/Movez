const yup = require('yup');

const priceProposalSchema = yup.object({
    uuid: yup.string(),
    RequestID: yup.string().required(),
    MoverID: yup.string().required(),
    MovingID: yup.string().required(),
    VehicleUUID: yup.string().required(),
    PriceOffer: yup.number().required(),
    PriceStatus: yup.string().required(),
})

const priceProposalUpdateSchema = yup.lazy((values) =>
    yup.object().shape({
        RequestID: yup.string(),
        MoverID: yup.string(),
        MovingID: yup.string(),
        VehicleUUID: yup.string(),
        PriceOffer: yup.number(),
    }).test({
        name: 'at-least-one-field',
        exclusive: true,
        message:
            'At least one of the following fields is required: RequestID, MoverID, MovingID, VehicleUUID, PriceOffer',
        test: (obj) =>
            Object.keys(obj).some(
                (key) =>
                    key === 'RequestID' ||
                    key === 'MoverID' ||
                    key === 'MovingID' ||
                    key === 'VehicleUUID' ||
                    key === 'PriceOffer',
            ),
    })
);

const priceProposalPostValidation = async (req, res, next) => {
    try {
        await priceProposalSchema.validate(req.body);
        next();
    } catch (error) {
		console.log("error", error)
        res.status(400).json({ message: error.message });
    }
}

const validateUpdatePriceProposal = async (req, res, next) => {
    try {
        await priceProposalUpdateSchema.validate(req.body);
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }


}

module.exports = {
    priceProposalPostValidation,
    validateUpdatePriceProposal
}