// src/constants/index.js

const PRODUCT_STATUS = Object.freeze({
    AVAILABLE: "available",
    OUT_OF_STOCK: "out_of_stock",
});

const USER_ROLES = Object.freeze({
    USER: "user",
    ADMIN: "admin",
    COURIER: 'courier'
});

export { PRODUCT_STATUS, USER_ROLES };