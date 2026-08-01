import express from "express";
import UserMockController from "../controller/userMock.controller.js"

const router = express.Router();

router.get("/", UserMockController.getAllMocks);

router.post("/", UserMockController.createMock);

export default router;