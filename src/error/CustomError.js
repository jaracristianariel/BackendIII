// CREAR UN DICCIONARIO DE ERRORES
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
    // EmptyPasswrod, EmptyUser
    // EmptyIdError,
    ObjectIdParseError: {
        name: "ObjectIdParseError",
        code: 12000,
        message: "el Id proporcionado no tiene formato válido",
        statusCode: 400,
        cause: "el Id no tiene el frmato correspondiente a un ObjectId"
    }

}
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


//CREAR UNA CLASE PERSONALIZADA DE MANEJO DE ERRORES
//name, code (opcional), mensaje, statusCode, cause (opcional)

class CustomError extends Error {
    constructor({ name, code, message, statusCode, cause }) {
        super(message, { cause });
        this.name = name;
        this.code = code;
        this.statusCode = statusCode;
    }
}

export { CustomError, UserError, ProductError };