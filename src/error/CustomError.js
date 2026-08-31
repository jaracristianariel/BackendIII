// User Error
const UserError = {
    DuplicatedKeyError: {
        name: "DuplicatedKeyError",
        code: 11000,
        message: "Ya existe ese mail registrado",
        statusCode: 409,
        cause: "se intentó registrar un mail ya existente"
    },
    UserNotFoundError: {
        name: "UserNotFoundError",
        code: 3000,
        message: "Usuario no existente",
        statusCode: 404,
        cause: "el dato ingresado no existe o no se puede recuperar del registro"
    },
    EmptyUserError: {
        name: "EmptyUserError",
        code: 1000,
        message: "Faltan datos obligatorios del usuario",
        statusCode: 400,
        cause: "No se recibió el email o la contraseña"
    },
    ObjectIdParseError: {
        name: "ObjectIdParseError",
        code: 12000,
        message: "el Id proporcionado no tiene formato válido",
        statusCode: 400,
        cause: "el Id no tiene el formato correspondiente a un ObjectId"
    },
    InvalidRoleError: {
        name: "InvalidRoleError",
        code: 1001,
        message: "El rol indicado no es válido",
        statusCode: 400,
        cause: "El rol debe ser uno de los roles permitidos (user, admin, courier)"
    }
};

// Product Error
const ProductError = {
    EmptyProductError: {
        name: "EmptyProductError",
        code: 2000,
        message: "Faltan datos obligatorios del producto",
        statusCode: 400,
        cause: "No se recibió el nombre o el precio"
    },
    InvalidPriceError: {
        name: "InvalidPriceError",
        code: 2001,
        message: "El precio debe ser un número mayor o igual a 0",
        statusCode: 400,
        cause: "El precio recibido no es válido"
    },
    ProductNotFoundError: {
        name: "ProductNotFoundError",
        code: 2002,
        message: "Producto no existente",
        statusCode: 404,
        cause: "El producto solicitado no existe o no se puede recuperar"
    },
    ObjectIdParseError: {
        name: "ObjectIdParseError",
        code: 2003,
        message: "el Id proporcionado no tiene formato válido",
        statusCode: 400,
        cause: "el Id no tiene el formato correspondiente a un ObjectId"
    }
};

// Courier Error
const CourierError = {
    EmptyCourierError: {
        name: "EmptyCourierError",
        code: 4000,
        message: "Faltan datos obligatorios del repartidor",
        statusCode: 400,
        cause: "No se recibió el nombre o la zona"
    },
    CourierNotFoundError: {
        name: "CourierNotFoundError",
        code: 4001,
        message: "Repartidor no existente",
        statusCode: 404,
        cause: "El repartidor solicitado no existe o no se puede recuperar"
    },
    ObjectIdParseError: {
        name: "ObjectIdParseError",
        code: 4002,
        message: "el Id proporcionado no tiene formato válido",
        statusCode: 400,
        cause: "el Id no tiene el formato correspondiente a un ObjectId"
    }
};

// Order Error
const OrderError = {
    EmptyOrderError: {
        name: "EmptyOrderError",
        code: 5000,
        message: "Faltan datos obligatorios del pedido",
        statusCode: 400,
        cause: "No se recibió el cliente, la dirección o el peso"
    },
    InvalidWeightError: {
        name: "InvalidWeightError",
        code: 5001,
        message: "El peso debe ser un número mayor a 0",
        statusCode: 400,
        cause: "El peso recibido no es válido"
    },
    OrderNotFoundError: {
        name: "OrderNotFoundError",
        code: 5002,
        message: "Pedido no existente",
        statusCode: 404,
        cause: "El pedido solicitado no existe o no se puede recuperar"
    },
    ObjectIdParseError: {
        name: "ObjectIdParseError",
        code: 5003,
        message: "el Id proporcionado no tiene formato válido",
        statusCode: 400,
        cause: "el Id no tiene el formato correspondiente a un ObjectId"
    }
};

// Delivery Error
const DeliveryError = {
    EmptyDeliveryError: {
        name: "EmptyDeliveryError",
        code: 6000,
        message: "Faltan datos obligatorios de la entrega",
        statusCode: 400,
        cause: "No se recibió el pedido o el repartidor asociado"
    },
    DeliveryNotFoundError: {
        name: "DeliveryNotFoundError",
        code: 6001,
        message: "Entrega no existente",
        statusCode: 404,
        cause: "La entrega solicitada no existe o no se puede recuperar"
    },
    ObjectIdParseError: {
        name: "ObjectIdParseError",
        code: 6002,
        message: "el Id proporcionado no tiene formato válido",
        statusCode: 400,
        cause: "el Id no tiene el formato correspondiente a un ObjectId"
    }
};

// Upload Error
const UploadError = {
    FileRequiredError: {
        name: "FileRequiredError",
        code: 8000,
        message: "No se recibió ningún archivo",
        statusCode: 400,
        cause: "El campo del archivo llegó vacío"
    },
    InvalidFileTypeError: {
        name: "InvalidFileTypeError",
        code: 8001,
        message: "El tipo de archivo no está permitido",
        statusCode: 400,
        cause: "Solo se aceptan PDF, JPG y PNG"
    },
    FileTooLargeError: {
        name: "FileTooLargeError",
        code: 8002,
        message: "El archivo supera el tamaño máximo permitido",
        statusCode: 400,
        cause: "El tamaño máximo permitido es 5MB"
    },
    InvalidDocumentTypeError: {
        name: "InvalidDocumentTypeError",
        code: 8003,
        message: "El tipo de documento indicado no es válido",
        statusCode: 400,
        cause: "El tipo de documento debe ser uno de los permitidos (dni, license, other)"
    },
    UploadFailedError: {
        name: "UploadFailedError",
        code: 8004,
        message: "Ocurrió un error al guardar el archivo",
        statusCode: 500,
        cause: "Falló el guardado del archivo o sus metadatos"
    }
};

// Mock Error (para el módulo de datos de prueba)
const MockError = {
    InvalidQtyError: {
        name: "InvalidQtyError",
        code: 7000,
        message: "La cantidad solicitada no es válida",
        statusCode: 400,
        cause: "qty debe ser un número entero mayor a 0 (y menor o igual al máximo permitido)"
    },
    MockInsertError: {
        name: "MockInsertError",
        code: 7001,
        message: "Ocurrió un error al insertar los datos de prueba",
        statusCode: 500,
        cause: "Falló la carga de los datos simulados en MongoDB"
    }
};

// Clase personalizada de manejo de errores
class CustomError extends Error {
    constructor({ name, code, message, statusCode, cause }) {
        super(message, { cause });
        this.name = name;
        this.code = code;
        this.statusCode = statusCode;
    }
}

export { CustomError, UserError, ProductError, CourierError, OrderError, DeliveryError, MockError, UploadError };