import express from "express";
import { getPricingRules, addPricingRule } from "../controllers/pricingRuleController.js";

const router = express.Router();

router.get("/", getPricingRules);
router.post("/admin", addPricingRule);

export default router;
