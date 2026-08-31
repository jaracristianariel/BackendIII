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

const ORDER_STATUS = Object.freeze({
    PENDING: "pending",
    IN_TRANSIT: "in_transit",
    DELIVERED: "delivered",
});

const ORDER_PRIORITY = Object.freeze({
    NORMAL: "normal",
    HIGH: "high",
});

const DELIVERY_STATUS = Object.freeze({
    ASSIGNED: "assigned",
    IN_TRANSIT: "in_transit",
    DELIVERED: "delivered",
});
const DOCUMENT_TYPES = Object.freeze({
    DNI: "dni",
    LICENSE: "license",
    OTHER: "other",
});

export { PRODUCT_STATUS, USER_ROLES, ORDER_STATUS, ORDER_PRIORITY, DELIVERY_STATUS, DOCUMENT_TYPES };