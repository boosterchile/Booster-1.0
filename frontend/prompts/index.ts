/**
 * Centralized prompts for Gemini AI
 * Organized by feature/domain for easy maintenance and versioning
 */

// Route Optimization Prompts
export const ROUTE_PROMPTS = {
    optimization: (origin: string, destination: string) => `
Generate a concise route optimization summary for a truck going from ${origin} to ${destination}.
Include:
- Key roads and highways
- Potential challenges (weather, traffic, construction)
- Estimated travel time
- Alternative routes if applicable
Format the response as a brief, actionable summary.
  `.trim(),

    ecoRoute: (origin: string, destination: string, cargoType: string) => `
Suggest an eco-efficient route from ${origin} to ${destination} for ${cargoType}.
Consider:
- Fuel efficiency
- CO2 emissions
- Distance vs. time trade-offs
- Avoid congested areas when possible
Provide JSON response with: { route_name, estimated_fuel_savings, eco_benefits }
  `.trim(),
};

// Risk Analysis Prompts
export const RISK_PROMPTS = {
    shipmentRisk: (scenario: string) => `
Analyze the following risk scenario for a cargo shipment and provide a brief alert text (max 3 sentences):
"${scenario}"

As a logistics risk assessment AI, identify:
1. Risk level (Low/Medium/High)
2. Immediate concerns
3. Recommended action
  `.trim(),

    routeRisks: (origin: string, destination: string, weatherConditions?: string) => `
Analyze potential risks for a cargo route from ${origin} to ${destination}.
${weatherConditions ? `Current weather: ${weatherConditions}` : ''}

Provide JSON with:
{
  "risk_level": "Low" | "Medium" | "High",
  "potential_risks": ["risk1", "risk2"],
  "mitigation_suggestions": ["action1", "action2"]
}
  `.trim(),
};

// Cargo Consolidation Prompts
export const CONSOLIDATION_PROMPTS = {
    ltlConsolidation: (offers: string[]) => `
Analyze these LTL cargo offers for potential consolidation opportunities:
${offers.map((o, i) => `${i + 1}. ${o}`).join('\n')}

Evaluate if consolidation is beneficial and provide JSON:
{
  "is_good_candidate": boolean,
  "reasoning": string,
  "suggestion_description": string,
  "potential_benefit": string (e.g., "15% cost savings")
}
  `.trim(),

    ftlBackhaul: (vehicleInfo: string, offerInfo: string) => `
Analyze backhaul opportunity:
Vehicle: ${vehicleInfo}
Available Cargo: ${offerInfo}

Determine if this is a good backhaul match and provide JSON:
{
  "is_good_candidate": boolean,
  "reasoning": string,
  "suggestion_description": string,
  "potential_benefit": string
}
  `.trim(),

    forwardHaul: (cargoDetails: string, vehicleDetails: string) => `
Evaluate forward haul compatibility:
Cargo: ${cargoDetails}
Vehicle: ${vehicleDetails}

Check pickup/delivery alignment and provide JSON:
{
  "is_compatible_for_forward_haul": boolean,
  "reasoning": string,
  "pickup_feasibility_notes": string,
  "delivery_alignment_notes": string
}
  `.trim(),
};

// Sustainability Analysis Prompts
export const SUSTAINABILITY_PROMPTS = {
    carbonFootprint: (data: { trips: number; totalCO2: number; period: string }) => `
Analyze carbon footprint data:
- Total trips: ${data.trips}
- Total CO2e: ${data.totalCO2} kg
- Period: ${data.period}

Provide JSON analysis:
{
  "trends_observed": string,
  "optimization_impact_summary": string,
  "reduction_strategies": [string, string, string]
}
  `.trim(),

    ecoRoutesAnalysis: (routesData: string) => `
Analyze sustainability impact of eco-routes:
${routesData}

Provide JSON:
{
  "sustainability_impact_summary": string,
  "operational_efficiency_summary": string
}
  `.trim(),

    backhaulSustainability: (backhaulData: string) => `
Analyze sustainability contribution of backhaul optimization:
${backhaulData}

Provide JSON:
{
  "co2e_saved_summary": string,
  "empty_km_reduced_summary": string,
  "overall_sustainability_contribution": string
}
  `.trim(),

    esgReportAnalysis: (reportSummary: string) => `
Analyze this ESG report summary:
${reportSummary}

Provide JSON evaluation:
{
  "key_achievements": [string, string, string],
  "areas_for_improvement": [string, string],
  "overall_esg_rating_impression": "Strong" | "Moderate" | "Needs Improvement"
}
  `.trim(),

    certificationValidation: (certDetails: string) => `
Validate this certification based on description:
${certDetails}

Provide JSON validation:
{
  "is_seemingly_valid_based_on_description": boolean,
  "validation_summary": string,
  "key_compliance_indicators_met": [string, string]
}
  `.trim(),
};

// Alert Analysis Prompts
export const ALERT_PROMPTS = {
    impactAnalysis: (alertMessage: string, context: string) => `
Analyze the impact of this alert:
Alert: ${alertMessage}
Context: ${context}

Provide JSON:
{
  "impact": string (brief description),
  "suggested_actions": [string, string, string]
}
  `.trim(),
};

// Export all prompts
export const PROMPTS = {
    ROUTE: ROUTE_PROMPTS,
    RISK: RISK_PROMPTS,
    CONSOLIDATION: CONSOLIDATION_PROMPTS,
    SUSTAINABILITY: SUSTAINABILITY_PROMPTS,
    ALERT: ALERT_PROMPTS,
};
