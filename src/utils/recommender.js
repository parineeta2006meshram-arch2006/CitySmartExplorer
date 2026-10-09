/**
 * CitySmart Explorer - Recommendation Engine
 * 
 * CORE INNOVATION:
 * "Explore the city based on YOUR situation, not just based on popular places."
 * 
 * Takes user inputs:
 * - budget (number, e.g. 1500)
 * - availableTime (number, e.g. 5)
 * - interests (array of strings, e.g. ['Food', 'History'])
 * - safetyPreference ('standard', 'safer', 'highest')
 * - accessibilityPreference ('easy', 'any')
 * 
 * Returns:
 * - rankedPlaces: list of individually evaluated places with explainability reasons
 * - itinerary: a curated 2-to-3 stop schedule fitting within time & budget
 * - summary: aggregated metrics
 */

import { PUNE_DATA } from '../data/puneData.js';
import { calculateSmartScore } from './smartScore.js';

export function getRecommendations(filters) {
  const {
    budget = 1500,
    availableTime = 5,
    interests = ['Food', 'History'],
    safetyPreference = 'safer', // 'standard', 'safer', 'highest'
    accessibilityPreference = 'any' // 'easy', 'any'
  } = filters;

  const allPlaces = PUNE_DATA.places;

  // Step 1: Score each place and evaluate fit
  const evaluatedPlaces = allPlaces.map((place) => {
    const smartScoreData = calculateSmartScore(place);
    const smartScore = smartScoreData.overall;

    const reasons = [];
    let matchScore = 0; // custom ranking weight

    // 1. Interest Match
    const matchesInterest = interests.some((interest) => {
      if (interest.toLowerCase() === 'culture') {
        return place.tags.includes('culture') || place.tags.includes('heritage');
      }
      return place.category.toLowerCase() === interest.toLowerCase() ||
             place.tags.includes(interest.toLowerCase());
    });

    if (matchesInterest) {
      matchScore += 35;
      reasons.push(`Matches your interest in ${place.category}`);
    } else if (interests.length === 0) {
      matchScore += 10;
    }

    // 2. Budget Fit
    const fitsIndividualBudget = place.estimatedCost <= budget;
    if (fitsIndividualBudget) {
      matchScore += 25;
      if (place.estimatedCost === 0) {
        reasons.push(`Completely free of cost (saves your ₹${budget} budget)`);
      } else {
        reasons.push(`Fits your ₹${budget} budget (only ₹${place.estimatedCost})`);
      }
    } else {
      reasons.push(`Note: Requires ₹${place.estimatedCost}, slightly above current budget`);
    }

    // 3. Time Fit
    const fitsIndividualTime = place.timeRequired <= availableTime;
    if (fitsIndividualTime) {
      matchScore += 20;
      reasons.push(`Takes ${place.timeRequired} hrs (well within your ${availableTime} hrs available)`);
    }

    // 4. Safety Fit
    let passesSafety = true;
    if (safetyPreference === 'highest') {
      passesSafety = place.safetyScore >= 9.0;
      if (passesSafety) {
        matchScore += 20;
        reasons.push(`Meets Highest Safety criteria (rated ${place.safetyScore}/10)`);
      }
    } else if (safetyPreference === 'safer') {
      passesSafety = place.safetyScore >= 8.5;
      if (passesSafety) {
        matchScore += 15;
        reasons.push(`High safety score of ${place.safetyScore}/10 for peace of mind`);
      }
    } else {
      reasons.push(`Safety score: ${place.safetyScore}/10`);
      matchScore += 10;
    }

    // 5. Accessibility Fit
    let passesAccessibility = true;
    if (accessibilityPreference === 'easy') {
      passesAccessibility = place.accessibilityScore >= 8.0;
      if (passesAccessibility) {
        matchScore += 10;
        reasons.push(`Easy wheelchair & walking accessibility (${place.accessibilityScore}/10)`);
      }
    }

    // Add Smart Score bonus
    matchScore += smartScore * 2;

    return {
      ...place,
      smartScore,
      smartScoreData,
      matchScore,
      matchesInterest,
      fitsIndividualBudget,
      fitsIndividualTime,
      passesSafety,
      passesAccessibility,
      reasons
    };
  });

  // Filter based on strict constraints if possible, but keep graceful fallbacks
  let filtered = evaluatedPlaces.filter((p) => {
    // If strict safety or accessibility requested
    if (safetyPreference === 'highest' && p.safetyScore < 8.7) return false;
    if (safetyPreference === 'safer' && p.safetyScore < 8.3) return false;
    if (accessibilityPreference === 'easy' && p.accessibilityScore < 7.5) return false;
    // Don't show places exceeding entire budget if budget is nonzero
    if (budget > 0 && p.estimatedCost > budget * 1.5) return false;
    return true;
  });

  // If too aggressive filtering, fallback to evaluatedPlaces
  if (filtered.length < 3) {
    filtered = [...evaluatedPlaces];
  }

  // Sort by matchScore descending (prioritizing matched interests, smart score & safety)
  filtered.sort((a, b) => b.matchScore - a.matchScore);

  // Step 2: Assemble an intelligent, personalized itinerary
  const itinerary = buildPersonalizedItinerary(filtered, budget, availableTime, interests);

  return {
    rankedPlaces: filtered,
    itinerary,
    filtersApplied: {
      budget,
      availableTime,
      interests,
      safetyPreference,
      accessibilityPreference
    }
  };
}

/**
 * Builds a curated 2-3 stop itinerary that respects total budget and time
 */
function buildPersonalizedItinerary(candidates, maxBudget, maxTime, userInterests) {
  let selected = [];
  let currentCost = 0;
  let currentTime = 0;

  // We want category diversity: e.g. 1 Major Attraction/Culture + 1 Food + 1 Secondary/Relax
  const usedCategories = new Set();

  for (const place of candidates) {
    // Check if adding this place exceeds cumulative budget or time (with buffer)
    if (
      selected.length < 3 &&
      currentTime + place.timeRequired <= maxTime + 0.5 &&
      currentCost + place.estimatedCost <= maxBudget * 1.1
    ) {
      // Prioritize distinct category unless we don't have enough
      if (!usedCategories.has(place.category) || selected.length >= 2) {
        selected.push(place);
        usedCategories.add(place.category);
        currentCost += place.estimatedCost;
        currentTime += place.timeRequired;
      }
    }
  }

  // If still fewer than 2 stops, pick top 2 candidates
  if (selected.length < 2 && candidates.length >= 2) {
    selected = [candidates[0], candidates[1]];
    currentCost = selected.reduce((sum, p) => sum + p.estimatedCost, 0);
    currentTime = selected.reduce((sum, p) => sum + p.timeRequired, 0);
  }

  // Calculate summary metrics
  const totalCost = currentCost;
  const totalTime = Number(currentTime.toFixed(1));
  const avgSafety = Number((selected.reduce((sum, p) => sum + p.safetyScore, 0) / (selected.length || 1)).toFixed(1));
  const avgSmartScore = Number((selected.reduce((sum, p) => sum + p.smartScore, 0) / (selected.length || 1)).toFixed(1));

  // Determine itinerary journey theme
  let theme = "Balanced Explorer Plan";
  if (selected.some(p => p.category === "History") && selected.some(p => p.category === "Food")) {
    theme = "Heritage & Food Trail";
  } else if (selected.some(p => p.category === "Nature")) {
    theme = "Scenic Green Escape";
  } else if (selected.some(p => p.category === "Shopping")) {
    theme = "Culture & Market Discovery";
  }

  return {
    theme,
    stops: selected.map((place, index) => ({
      stopNumber: index + 1,
      role: index === 0 ? "Prime Destination" : (index === 1 ? "Food & Rest Hub" : "Leisure & Exploration"),
      place,
      estimatedTimeSpent: `${place.timeRequired} hrs`,
      cost: `₹${place.estimatedCost}`
    })),
    totalCost,
    totalTime,
    avgSafety,
    avgSmartScore,
    budgetRemaining: Math.max(0, maxBudget - totalCost),
    timeRemaining: Math.max(0, Number((maxTime - totalTime).toFixed(1)))
  };
}
