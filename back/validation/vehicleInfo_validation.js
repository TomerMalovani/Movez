const yup = require('yup');

const vehicleInfoSchema = yup.object({
    uuid: yup.string(),
    MoverID: yup.string().uuid().required(),
    VehicleType: yup.string().required(),
    VehicleModel: yup.string(),
    Depth: yup.number().required(),
    Width: yup.number().required(),
    Height: yup.number().required(),
    PhotoUrl: yup.string().url().notRequired()
})

const vehicleInfoUpdateSchema = yup.lazy((values) =>
    yup.object().shape({
        MoverID: yup.string().uuid(),
        VehicleType: yup.string(),
        VehicleModel: yup.string(),
        Depth: yup.number(),
        Width: yup.number(),
        Height: yup.number(),
    }).test({
        name: 'at-least-one-field',
        exclusive: true,
        message:
            'At least one of the following fields is required: MoverID, VehicleType, Depth, Width, Height',
        test: (obj) =>
            Object.keys(obj).some(
                (key) =>
                    key === 'MoverID' ||
                    key === 'VehicleType' ||
                    key === 'VehicleModel' ||
                    key === 'Depth' ||
                    key === 'Width' ||
                    key === 'Height'
            ),
    })
);

const vehicleInfoPostValidation = async (req, res, next) => {
    try {
		await vehicleInfoSchema.validate({ ...req.body, MoverID: req.userId});
        next();
    } catch (error) {
        console.log(error);
        console.log(error.message);
        res.status(400).json({ message: error.message });
    }
}

const validateUpdateVehicleInfo = async (req, res, next) => {
    try {
        if(!req.file)
        {
            await vehicleInfoUpdateSchema.validate(req.body);
        }
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

}

module.exports = {
    vehicleInfoPostValidation,
    validateUpdateVehicleInfo
}