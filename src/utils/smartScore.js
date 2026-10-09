/**
 * City Smart Score Calculation Algorithm
 * 
 * INNOVATION:
 * The Smart Score combines multiple urban factors into a single balanced index (0 - 10)
 * rather than relying purely on user reviews or popularity.
 * 
 * Sub-factors and Weights:
 * - Safety: 30%
 * - Affordability: 25% (normalized from estimated cost)
 * - Rating: 20% (normalized from 5-star scale to 10-scale)
 * - Cleanliness: 15%
 * - Accessibility: 10%
 */

export function calculateAffordabilityScore(cost) {
  // Free / ₹0 gets 10/10
  if (cost <= 0) return 10.0;
  // Under ₹50: 9.6
  if (cost <= 50) return 9.6;
  // Under ₹100: 9.3
  if (cost <= 100) return 9.3;
  // Under ₹250: 8.8
  if (cost <= 250) return 8.8;
  // Under ₹400: 8.2
  if (cost <= 400) return 8.2;
  // Under ₹650: 7.5
  if (cost <= 650) return 7.5;
  // Under ₹1000: 6.8
  if (cost <= 1000) return 6.8;
  // Above ₹1000: scales down smoothly to minimum 4.5
  const scaled = Math.max(4.5, 6.8 - ((cost - 1000) / 1500) * 2.0);
  return Number(scaled.toFixed(1));
}

export function calculateSmartScore(place) {
  const safety = place.safetyScore || 8.0;
  const affordability = calculateAffordabilityScore(place.estimatedCost || 0);
  const ratingNormalized = (place.rating / 5) * 10;
  const cleanliness = place.cleanlinessScore || 8.0;
  const accessibility = place.accessibilityScore || 7.5;

  // Weighted calculation (Sum of weights = 1.0)
  const weightedScore = (
    safety * 0.30 +
    affordability * 0.25 +
    ratingNormalized * 0.20 +
    cleanliness * 0.15 +
    accessibility * 0.10
  );

  return {
    overall: Number(weightedScore.toFixed(1)),
    factors: {
      safety: {
        score: Number(safety.toFixed(1)),
        weight: "30%",
        label: "Safety & Security",
        description: "Lighting, crowd management & patrolling"
      },
      affordability: {
        score: affordability,
        weight: "25%",
        label: "Affordability",
        description: `Based on estimated cost ₹${place.estimatedCost}`
      },
      rating: {
        score: Number(ratingNormalized.toFixed(1)),
        rawRating: place.rating,
        weight: "20%",
        label: "User Rating",
        description: `${place.rating} / 5.0 stars from verified visitors`
      },
      cleanliness: {
        score: Number(cleanliness.toFixed(1)),
        weight: "15%",
        label: "Cleanliness & Hygiene",
        description: "Sanitation, waste management & upkeep"
      },
      accessibility: {
        score: Number(accessibility.toFixed(1)),
        weight: "10%",
        label: "Accessibility",
        description: "Paved pathways, ramps & transit proximity"
      }
    }
  };
}

/**
 * Compare two places across all 5 Smart Score factors
 */
export function comparePlaces(placeA, placeB) {
  const scoreA = calculateSmartScore(placeA);
  const scoreB = calculateSmartScore(placeB);

  const factorKeys = ["safety", "affordability", "rating", "cleanliness", "accessibility"];
  const comparisons = factorKeys.map((key) => {
    const valA = scoreA.factors[key].score;
    const valB = scoreB.factors[key].score;
    let winner = "tie";
    if (valA > valB) winner = "A";
    else if (valB > valA) winner = "B";

    return {
      factorKey: key,
      label: scoreA.factors[key].label,
      scoreA: valA,
      scoreB: valB,
      winner,
      diff: Math.abs(Number((valA - valB).toFixed(1)))
    };
  });

  // Calculate overall winner
  let overallWinner = "tie";
  if (scoreA.overall > scoreB.overall) overallWinner = "A";
  else if (scoreB.overall > scoreA.overall) overallWinner = "B";

  // Generate explainable justification
  let justification = "";
  if (overallWinner === "A") {
    justification = `${placeA.name} is the stronger overall choice with a Smart Score of ${scoreA.overall}/10 (vs ${scoreB.overall}/10). It excels particularly in ${comparisons.filter(c => c.winner === 'A').map(c => c.label).join(', ')}.`;
  } else if (overallWinner === "B") {
    justification = `${placeB.name} is the stronger overall choice with a Smart Score of ${scoreB.overall}/10 (vs ${scoreA.overall}/10). It stands out in ${comparisons.filter(c => c.winner === 'B').map(c => c.label).join(', ')}.`;
  } else {
    justification = `Both ${placeA.name} and ${placeB.name} have an identical high Smart Score of ${scoreA.overall}/10. Choose based on whether your primary interest is ${placeA.category} or ${placeB.category}.`;
  }

  return {
    scoreA,
    scoreB,
    comparisons,
    overallWinner,
    justification
  };
}
