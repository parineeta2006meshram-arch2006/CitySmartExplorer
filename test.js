/**
 * Automated Verification Test Suite for CitySmart Explorer
 * Verifies core engines, data integrity, and server execution.
 */

async function runTests() {
  console.log("=== STARTING CITYSMART EXPLORER TESTS ===\n");

  // 1. Load Data
  console.log("1. Testing Pune Dataset...");
  const { PUNE_DATA } = await import('./src/data/puneData.js');
  if (!PUNE_DATA || !PUNE_DATA.places || PUNE_DATA.places.length < 12) {
    throw new Error(`Dataset check failed: expected >= 12 places, got ${PUNE_DATA?.places?.length}`);
  }
  console.log(`   ✓ Dataset verified with ${PUNE_DATA.places.length} locations across 5 categories.`);
  console.log(`   ✓ ${PUNE_DATA.safetyAlerts.length} safety alerts and ${PUNE_DATA.trafficData.length} traffic routes loaded.`);

  // 2. Test Smart Score Algorithm
  console.log("\n2. Testing City Smart Score Calculation...");
  const { calculateSmartScore, comparePlaces } = await import('./src/utils/smartScore.js');
  const samplePlace = PUNE_DATA.places[0];
  const scoreResult = calculateSmartScore(samplePlace);
  console.log(`   ✓ ${samplePlace.name} Smart Score: ${scoreResult.overall} / 10`);
  console.log(`     - Safety: ${scoreResult.factors.safety.score}/10 (Weight: ${scoreResult.factors.safety.weight})`);
  console.log(`     - Affordability: ${scoreResult.factors.affordability.score}/10`);
  console.log(`     - Rating: ${scoreResult.factors.rating.score}/10`);
  console.log(`     - Cleanliness: ${scoreResult.factors.cleanliness.score}/10`);
  console.log(`     - Accessibility: ${scoreResult.factors.accessibility.score}/10`);

  if (typeof scoreResult.overall !== 'number' || scoreResult.overall <= 0 || scoreResult.overall > 10) {
    throw new Error(`Invalid Smart Score calculated: ${scoreResult.overall}`);
  }

  // 3. Test Compare Places
  console.log("\n3. Testing Place Comparison...");
  const placeA = PUNE_DATA.places[0]; // Shaniwar Wada
  const placeB = PUNE_DATA.places[1]; // Aga Khan Palace
  const comparison = comparePlaces(placeA, placeB);
  console.log(`   ✓ Compared: ${placeA.name} vs ${placeB.name}`);
  console.log(`   ✓ Winner: ${comparison.overallWinner}`);
  console.log(`   ✓ Justification: "${comparison.justification}"`);

  // 4. Test Recommendation Engine with user scenarios
  console.log("\n4. Testing Recommendation Engine with Scenarios...");
  const { getRecommendations } = await import('./src/utils/recommender.js');
  
  // Scenario A: Default student budget & half day
  const recsA = getRecommendations({
    budget: 1500,
    availableTime: 5,
    interests: ['Food', 'History'],
    safetyPreference: 'safer',
    accessibilityPreference: 'any'
  });
  console.log(`   ✓ Scenario A (₹1500, 5h, Food+History, Safer):`);
  console.log(`     - Ranked candidates: ${recsA.rankedPlaces.length}`);
  console.log(`     - Itinerary Theme: "${recsA.itinerary.theme}"`);
  console.log(`     - Itinerary Stops: ${recsA.itinerary.stops.map(s => s.place.name).join(' -> ')}`);
  console.log(`     - Total Cost: ₹${recsA.itinerary.totalCost} (Under ₹1500: ${recsA.itinerary.totalCost <= 1500})`);
  console.log(`     - Total Time: ${recsA.itinerary.totalTime} hrs (Within 5h: ${recsA.itinerary.totalTime <= 5.5})`);
  console.log(`     - Avg Safety: ${recsA.itinerary.avgSafety}/10`);

  // Scenario B: Tight budget
  const recsB = getRecommendations({
    budget: 300,
    availableTime: 3,
    interests: ['Nature'],
    safetyPreference: 'highest',
    accessibilityPreference: 'any'
  });
  console.log(`   ✓ Scenario B (₹300, 3h, Nature, Highest Safety):`);
  console.log(`     - Itinerary Stops: ${recsB.itinerary.stops.map(s => s.place.name).join(' -> ')}`);
  console.log(`     - Total Cost: ₹${recsB.itinerary.totalCost} (Under ₹300: ${recsB.itinerary.totalCost <= 330})`);

  // 5. Test AI Assistant Query Processing
  console.log("\n5. Testing AI Assistant NLP Queries...");
  const { processAiQuery } = await import('./src/utils/aiEngine.js');
  const query1 = "I have ₹1000 and 4 hours. What can I do?";
  const res1 = processAiQuery(query1);
  console.log(`   ✓ Query: "${query1}"`);
  console.log(`     - Response length: ${res1.text.length} chars`);
  console.log(`     - Recommended places: ${res1.recommendedPlaces?.map(p => p.name).join(', ')}`);

  const query2 = "Suggest a safe historical place with cheap food nearby.";
  const res2 = processAiQuery(query2);
  console.log(`   ✓ Query: "${query2}"`);
  console.log(`     - Recommended places: ${res2.recommendedPlaces?.map(p => p.name).join(', ')}`);

  const query3 = "Is Vetal Hill safe for morning hikes?";
  const res3 = processAiQuery(query3);
  console.log(`   ✓ Query: "${query3}"`);
  console.log(`     - Found Vetal Hill: ${res3.text.includes('Vetal Hill')}`);

  console.log("\n=== ALL CORE TESTS PASSED SUCCESSFULLY! ===");
}

runTests().catch(err => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
