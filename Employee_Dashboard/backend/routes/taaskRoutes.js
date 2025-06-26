import express from "express";
import { getTaasks, createTaask, updateTaask, deleteTaask } from "../controllers/taaskController.js";

const router = express.Router();

router.get("/", getTaasks);
router.post("/", createTaask);
router.put("/:id", updateTaask);
router.delete("/:id", deleteTaask);

export default router;
