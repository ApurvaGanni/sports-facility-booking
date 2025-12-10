import PricingRule from "../models/PricingRule.js";

export async function getPricingRules(req, res, next) {
  try {
    const rules = await PricingRule.find({ isActive: true });
    res.json(rules);
  } catch (err) {
    next(err);
  }
}

export async function addPricingRule(req, res, next) {
  try {
    const rule = await PricingRule.create(req.body);
    res.status(201).json(rule);
  } catch (err) {
    next(err);
  }
}
