/**
 * Calculate dynamic price using rules.
 * @param {number} basePrice
 * @param {Array} rules - PricingRule docs
 * @param {Date} startTime
 * @param {Object} options - { courtType, rackets, shoes }
 */
export function calculatePrice(basePrice, rules, startTime, options = {}) {
  let price = basePrice;
  let weekendFee = 0;
  let peakHourFee = 0;
  let courtTypeFee = 0;
  let equipmentFee = 0;

  const dateObj = new Date(startTime);
  const day = dateObj.getDay(); // 0 Sunday - 6 Saturday
  const hour = dateObj.getHours();
  const { courtType, rackets = 0, shoes = 0 } = options;

  rules
    .filter((r) => r.isActive)
    .forEach((rule) => {
      if (rule.type === "weekend") {
        if (day === 0 || day === 6) {
          weekendFee += rule.weekendSurcharge || 0;
        }
      }

      if (rule.type === "peak") {
        if (typeof rule.startHour === "number" && typeof rule.endHour === "number") {
          if (hour >= rule.startHour && hour < rule.endHour) {
            const before = price;
            price = price * (rule.multiplier || 1);
            peakHourFee += price - before;
          }
        }
      }

      if (rule.type === "courtType" && courtType && rule.courtType === courtType) {
        courtTypeFee += rule.courtTypeSurcharge || 0;
      }

      if (rule.type === "fixed") {
        courtTypeFee += rule.fixedSurcharge || 0;
      }
    });

  price += weekendFee + courtTypeFee;

  // Simple equipment fee: 5 per racket, 3 per shoes pair
  equipmentFee = rackets * 5 + shoes * 3;
  price += equipmentFee;

  return {
    basePrice,
    weekendFee,
    peakHourFee,
    courtTypeFee,
    equipmentFee,
    total: price
  };
}
