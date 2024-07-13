const yup = require('yup');

const moveRequestItemSchema = yup.object({
    uuid: yup.string(),
    MoveRequestID: yup.string().required(),
    ItemDescription: yup.string().required(),
    Height: yup.number().required(),
    Width: yup.number().required(),
    Depth: yup.number().required(),
    Weight: yup.number().required(),
    Quantity: yup.number().required(),
    SpecialInstructions: yup.string(),
    PhotoUrl: yup.string()
})

const updateMoveRequestItemSchema = yup.lazy((values) =>
    yup.object().shape({
      MoveRequestID: yup.string(),
      ItemDescription: yup.string(),
      Height: yup.number(),
      Width: yup.number(),
      Depth: yup.number(),
      Weight: yup.number(),
      Quantity: yup.number(),
      SpecialInstructions: yup.string(),
      PhotoUrl: yup.string().url()
    }).test({
      name: 'at-least-one-field',
      exclusive: true,
      message:
        'At least one of the following fields is required: MoveRequestID, ItemDescription, Height, Width, Depth, Weight, Quantity, SpecialInstructions',
      test: (obj) =>
        Object.keys(obj).some(
          (key) =>
            key === 'MoveRequestID' ||
            key === 'ItemDescription' ||
            key === 'Height' ||
            key === 'Width' ||
            key === 'Depth' ||
            key === 'Weight' ||
            key === 'Quantity' ||
            key === 'SpecialInstructions' ||
            key === 'PhotoUrl'
        ),
    })
  );
const validateUpdateMoveRequestItem = async (req, res, next) => {
    try {
        await updateMoveRequestItemSchema.validate(req.body);
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const moveRequestItemPostValidation = async (req, res, next) => {
    try {
        await moveRequestItemSchema.validate(req.body);
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    moveRequestItemPostValidation,
    validateUpdateMoveRequestItem
}