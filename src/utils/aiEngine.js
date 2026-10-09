/**
 * CitySmart Explorer - AI City Assistant Engine
 * 
 * Local lightweight Natural Language Processing (NLP) & Rule-based Recommendation Engine.
 * Parses user input for:
 * - Budget numbers (₹, Rs, numbers)
 * - Duration/hours (e.g., "4 hours", "3 hrs")
 * - Category interests (food, history, nature, shopping, stay)
 * - Safety requirements ("safe", "highest safety", "alone", "solo")
 * - Demographics ("family", "friends", "kids", "students")
 * 
 * Easily swappable for Gemini / OpenAI API in production if API key provided.
 */

import { PUNE_DATA } from '../data/puneData.js';
import { calculateSmartScore } from './smartScore.js';

export function processAiQuery(userInput) {
  const query = userInput.trim().toLowerCase();
  const places = PUNE_DATA.places;

  // Extract budget
  let extractedBudget = null;
  const budgetMatch = query.match(/(?:₹|rs\.?|inr|budget\s*of|under|within)?\s*(\d{2,5})/i);
  if (budgetMatch && !query.includes('hour') && !query.includes('hr')) {
    extractedBudget = parseInt(budgetMatch[1], 10);
  } else {
    const rupeeRegex = /(?:₹|rs\.?)\s*(\d+)/i;
    const rMatch = query.match(rupeeRegex);
    if (rMatch) extractedBudget = parseInt(rMatch[1], 10);
  }

  // Extract time/hours
  let extractedHours = null;
  const hourMatch = query.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h\b)/i);
  if (hourMatch) {
    extractedHours = parseFloat(hourMatch[1]);
  }

  // Detect category keywords
  const wantsHistory = query.includes('history') || query.includes('fort') || query.includes('palace') || query.includes('monument') || query.includes('heritage') || query.includes('wada');
  const wantsFood = query.includes('food') || query.includes('eat') || query.includes('hungry') || query.includes('cafe') || query.includes('breakfast') || query.includes('dinner') || query.includes('snack') || query.includes('thali') || query.includes('biryani');
  const wantsNature = query.includes('nature') || query.includes('hill') || query.includes('lake') || query.includes('green') || query.includes('hike') || query.includes('trek') || query.includes('bird') || query.includes('sunset') || query.includes('morning');
  const wantsShopping = query.includes('shopping') || query.includes('shop') || query.includes('buy') || query.includes('market') || query.includes('mall') || query.includes('clothes');
  const wantsHotel = query.includes('hotel') || query.includes('stay') || query.includes('room') || query.includes('resort') || query.includes('luxury');
  
  // Detect constraints
  const wantsHighSafety = query.includes('safe') || query.includes('safety') || query.includes('solo') || query.includes('night') || query.includes('girl') || query.includes('woman');
  const wantsCheap = query.includes('cheap') || query.includes('affordable') || query.includes('budget') || query.includes('free') || query.includes('low cost');
  const wantsFamily = query.includes('family') || query.includes('parents') || query.includes('kids') || query.includes('children');
  const wantsFirstVisit = query.includes('first') || query.includes('must visit') || query.includes('top') || query.includes('best');

  // Specific landmark queries
  if (query.includes('vetal hill') || query.includes('arai')) {
    const p = places.find(x => x.id === 'vetal-hill');
    return {
      text: `**Vetal Hill (ARAI Tekdi)** is an exceptional choice! It's Pune's highest urban peak (2,600 ft).\n\n• **Safety:** Rated **8.9/10**. Mornings (6:00 AM – 9:00 AM) are filled with runners and walkers, making it very safe.\n• **Cost:** Completely free (₹0).\n• **Time needed:** About 2 hours.\n• **Smart Score:** 9.2/10.\n• **Safety Tip:** Avoid isolated side trails after dusk; stick to the paved main path to ARAI ridge.`,
      recommendedPlaces: [p],
      action: { type: 'explore', label: 'View Vetal Hill in Smart Explore' }
    };
  }

  if (query.includes('shaniwar wada')) {
    const p = places.find(x => x.id === 'shaniwar-wada');
    return {
      text: `**Shaniwar Wada** is the historical heartbeat of Pune, built in 1732 as the Peshwa ruler's headquarters.\n\n• **Cost:** Only ₹100 including tickets & refreshments.\n• **Safety:** 8.8/10 with dedicated security guards and illuminated courtyards.\n• **Ideal combination:** Pair with a 10-minute walk to Lal Mahal or FC Road cafes for an afternoon plan.`,
      recommendedPlaces: [p],
      action: { type: 'compare', label: 'Compare Shaniwar Wada' }
    };
  }

  // Combined Budget + Time request (e.g. "I have ₹1000 and 4 hours. What can I do?")
  if ((extractedBudget || wantsCheap) && (extractedHours || query.includes('hour') || query.includes('day'))) {
    const b = extractedBudget || 1000;
    const t = extractedHours || 4;

    // Filter matching places
    let candidatePlaces = places.filter(p => p.estimatedCost <= b && p.timeRequired <= t);
    if (wantsHighSafety) {
      candidatePlaces = candidatePlaces.filter(p => p.safetyScore >= 8.5);
    }
    candidatePlaces.sort((a, b) => (b.safetyScore + (5 - a.estimatedCost / 200)) - (a.safetyScore + (5 - b.estimatedCost / 200)));

    const top2 = candidatePlaces.slice(0, 2);
    const combinedCost = top2.reduce((s, p) => s + p.estimatedCost, 0);
    const combinedTime = top2.reduce((s, p) => s + p.timeRequired, 0);

    return {
      text: `Here is a custom plan tailored for your budget of **₹${b}** and **${t} hours** in Pune:\n\n1. **${top2[0]?.name || 'Shaniwar Wada'}** (${top2[0]?.category}) – Est. ₹${top2[0]?.estimatedCost}, ~${top2[0]?.timeRequired}h\n2. **${top2[1]?.name || 'FC Road Food Zone'}** (${top2[1]?.category}) – Est. ₹${top2[1]?.estimatedCost}, ~${top2[1]?.timeRequired}h\n\n• **Total Estimated Cost:** ₹${combinedCost} (Leaves you ₹${Math.max(0, b - combinedCost)} in buffer)\n• **Total Estimated Time:** ${combinedTime} hrs\n• **Why this works:** Both spots are geographically close, safe, and balance cultural discovery with great food!`,
      recommendedPlaces: top2,
      action: { type: 'plan', label: 'Load this Plan in Smart Explore', budget: b, time: t }
    };
  }

  // Safe historical place with food nearby
  if (wantsHistory && (wantsFood || query.includes('food nearby') || query.includes('cheap food'))) {
    const historyPlace = places.find(p => p.id === 'shaniwar-wada' || p.id === 'aga-khan-palace');
    const foodPlace = places.find(p => p.id === 'fc-road-food');
    return {
      text: `The best historical & food pairing in Pune is **${historyPlace.name}** followed by **${foodPlace.name}**:\n\n• **Heritage Stop:** ${historyPlace.name} (Safety: ${historyPlace.safetyScore}/10, Entry: ₹${historyPlace.estimatedCost})\n• **Food Stop:** ${foodPlace.name} (Safety: ${foodPlace.safetyScore}/10, Avg meal: ₹${foodPlace.estimatedCost})\n• **Why it's recommended:** FC Road is only 3 km from the historical core, heavily patrolled, vibrant into the late evening, and offers famous budget treats like Vaishali dosa and Cafe Goodluck maska bun!`,
      recommendedPlaces: [historyPlace, foodPlace],
      action: { type: 'explore', label: 'Customize in Smart Explore' }
    };
  }

  // Family friendly inquiry
  if (wantsFamily) {
    const familyPlaces = places.filter(p => p.bestFor.some(b => b.toLowerCase().includes('fam') || b.toLowerCase().includes('peace')) || p.safetyScore >= 9.0).slice(0, 3);
    return {
      text: `For families, safety, accessibility, and comfortable seating are critical. Here are the top family-rated locations in Pune:\n\n1. **Aga Khan Palace:** Beautiful sprawling green lawns, paved wheelchair ramps, very quiet and dignified (Safety: 9.4/10).\n2. **Saras Baug & Peshwe Park:** Gated municipal garden with lotus ponds, temple, and food stalls (Accessibility: 8.5/10).\n3. **Phoenix Marketcity:** Climate-controlled, ultra-safe modern entertainment & dining hub (Safety: 9.6/10).`,
      recommendedPlaces: familyPlaces,
      action: { type: 'compare', label: 'Compare Family Places' }
    };
  }

  // Affordable / Cheap / Budget places
  if (wantsCheap) {
    const cheapPlaces = places.filter(p => p.estimatedCost <= 100).sort((a, b) => calculateSmartScore(b).overall - calculateSmartScore(a).overall).slice(0, 3);
    return {
      text: `Pune offers incredible high-value experiences that cost almost nothing! Here are the highest Smart Score budget spots:\n\n` +
        cheapPlaces.map(p => `• **${p.name}** (${p.category}) – Cost: ₹${p.estimatedCost} | Safety: ${p.safetyScore}/10 | Smart Score: ${calculateSmartScore(p).overall}/10\n  _${p.shortDescription}_`).join('\n\n'),
      recommendedPlaces: cheapPlaces,
      action: { type: 'plan', label: 'Plan on ₹300 Budget' }
    };
  }

  // Safe places / Solo traveler
  if (wantsHighSafety) {
    const safePlaces = places.filter(p => p.safetyScore >= 9.0).sort((a, b) => b.safetyScore - a.safetyScore).slice(0, 3);
    return {
      text: `Here are Pune's highest safety-rated destinations (all scoring 9.0+ / 10):\n\n` +
        safePlaces.map(p => `• **${p.name}** – Safety: **${p.safetyScore}/10** (${p.safetyNotes})`).join('\n\n') +
        `\n\n💡 **Traveler Tip:** Check our **Safety & Alerts** section for real-time crowd and traffic advisories around old city junctions.`,
      recommendedPlaces: safePlaces,
      action: { type: 'safety', label: 'View Live Safety Alerts' }
    };
  }

  // General or first visit recommendations
  const topSpots = places.filter(p => p.rating >= 4.6).slice(0, 3);
  return {
    text: `Welcome to Pune! If you're deciding where to start, here are 3 top-rated locations with exceptional City Smart Scores:\n\n1. **Aga Khan Palace** (Heritage & Peace, Smart Score: 9.2/10)\n2. **Vetal Hill** (Nature & Sunrise views, Smart Score: 9.1/10)\n3. **FC Road Food Zone** (Culinary & Vibrant street life, Smart Score: 8.9/10)\n\nTry telling me your budget (e.g. _"₹1200"_), how many hours you have (e.g. _"3 hours"_), or ask for family/solo safety recommendations!`,
    recommendedPlaces: topSpots,
    action: { type: 'explore', label: 'Start Smart Explore' }
  };
}

export const SUGGESTED_QUESTIONS = [
  "I have ₹1000 and 4 hours. What can I do?",
  "Suggest a safe historical place with cheap food nearby.",
  "Which place is better for a family?",
  "Show me affordable places under ₹200.",
  "Is Vetal Hill safe for morning hikes?",
  "What should I visit first in Pune?"
];
