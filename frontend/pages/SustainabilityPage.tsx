
// FIX: Added useMemo to React imports
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { LeafIcon, ZapIcon, PackageIconPhosphor, RouteIcon, CheckCircleIcon, BookOpenIcon } from '../components/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { geminiService } from '../services/geminiService';
import { apiService } from '../services/apiService';
import { DEFAULT_ERROR_MESSAGE, INDUSTRY_BENCHMARKS, PLATFORM_AVERAGES } from '../constants';
import { 
    CarbonFootprintAIAnalysis, 
    EcoRoutesAIAnalysis, 
    BackhaulAIAnalysis,
    OtherSustainabilityInitiative,
    OtherInitiativeAIAnalysis,
    EsgReport,
    Certification,
    EsgReportAIAnalysis,
    CertificationAIValidation
} from '../types';
import LoadingSpinner from '../components/LoadingSpinner';


const initialOtherInitiativesData: OtherSustainabilityInitiative[] = [
  {
    id: 'low_emission_vehicles',
    title: 'Vehículos de Bajas Emisiones en Red',
    description: 'Colaboración con transportistas que usan 25+ vehículos eléctricos y 40+ híbridos. Se priorizan en asignaciones cuando es factible.',
    dataForAI: { electricVehicles: 25, hybridVehicles: 40, priorityAssignment: 'factible' },
    aiAnalysis: null, isLoadingAI: false, errorAI: null,
  },
  {
    id: 'reverse_logistics_packaging',
    title: 'Logística Inversa y Optimización de Embalajes',
    description: 'Programas piloto para recolección y reciclaje de embalajes y fomento de uso de materiales sostenibles.',
    dataForAI: { programStatus: 'piloto activo', focusAreas: 'recolección, reciclaje, materiales sostenibles en embalajes' },
    aiAnalysis: null, isLoadingAI: false, errorAI: null,
  },
];

const mockEsgReportsData: EsgReport[] = [
    {
        id: 'ESG2023', title: 'Reporte Anual de Sostenibilidad 2023', type: 'ESG Annual Report', year: 2023, publicationDate: '2024-03-15',
        summaryDescription: 'Informe integral sobre el desempeño ambiental, social y de gobernanza de la empresa durante el año 2023, destacando avances en reducción de emisiones y programas comunitarios.',
        documentLink: 'simulated-esg-report-2023.html', aiAnalysis: null, isLoadingAI: false, errorAI: null,
    },
    {
        id: 'CDP2023', title: 'Reporte de Divulgación de Carbono (CDP) 2023', type: 'Carbon Disclosure Report', year: 2023, publicationDate: '2024-05-20',
        summaryDescription: 'Detalla las emisiones de GEI de Alcance 1, 2 y 3, así como las estrategias de mitigación y adaptación al cambio climático.',
        documentLink: 'simulated-cdp-report-2023.html', aiAnalysis: null, isLoadingAI: false, errorAI: null,
    }
];

const mockCertificationsData: Certification[] = [
    {
        id: 'ISO14001', name: 'ISO 14001:2015 - Sistema de Gestión Ambiental', issuingBody: 'SGS Global', issueDate: '2023-01-20', expiryDate: '2026-01-19',
        status: 'Active', verificationDetailsLink: '#', aiValidation: null, isLoadingAI: false, errorAI: null,
    },
    {
        id: 'BCORP', name: 'Certificación B Corporation', issuingBody: 'B Lab', issueDate: '2022-11-01', expiryDate: '2025-10-31',
        status: 'Pending AI Validation', aiValidation: null, isLoadingAI: false, errorAI: null,
    }
];

const getGenericSustainabilityData = () => ({
    totalTrips: 250, 
    ecoOptimizedTrips: 180,
    fuelSavedByEcoRoutesPercent: 12,
    backhaulsFacilitated: 75,
    avgEmptyLegKmPerBackhaul: 280,
    co2ePerKmStandardKg: 0.65,
    monthlyEmissions: [ 
      { month: 'Ene', actualCo2eKg: 5500, baselineCo2eKg: 6000 }, { month: 'Feb', actualCo2eKg: 5200, baselineCo2eKg: 5800 },
      { month: 'Mar', actualCo2eKg: 5800, baselineCo2eKg: 6200 }, { month: 'Abr', actualCo2eKg: 5600, baselineCo2eKg: 6100 },
      { month: 'May', actualCo2eKg: 5300, baselineCo2eKg: 5900 }, { month: 'Jun', actualCo2eKg: 5000, baselineCo2eKg: 5500 },
    ],
    platform_co2PerKm_kg: PLATFORM_AVERAGES.CARRIER.co2PerKm_kg, platform_emptyRunPercentage: PLATFORM_AVERAGES.CARRIER.emptyRunPercentage,
    platform_averageLoadFactor_percent: PLATFORM_AVERAGES.CARRIER.averageLoadFactor_percent, platform_co2PerTonKm_kg: PLATFORM_AVERAGES.SHIPPER.co2PerTonKm_kg, 
    platform_onTimeDelivery_percent: PLATFORM_AVERAGES.SHIPPER.onTimeDelivery_percent,
});

// --- Reusable Components ---
const cardBaseStyle = "bg-[#1a1f25] border border-[#40474f] shadow-lg rounded-xl p-4 sm:p-6 text-white";
const buttonPrimaryStyle = "w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md transition duration-150 disabled:opacity-60 flex items-center justify-center mobile-tap-target";
const sectionTitleStyle = "text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6"; 

const AIAnalysisSection: React.FC<{
  isLoading: boolean;
  error: string | null;
  analysisData: any;
  title: string;
  dataRenderer: () => React.ReactNode;
}> = ({ isLoading, error, analysisData, title, dataRenderer }) => (
    <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
      <h4 className="text-sm sm:text-base font-semibold text-green-200 mb-1 sm:mb-2">{title}</h4>
      {isLoading && <div className="flex items-center text-xs sm:text-sm text-green-300"><LoadingSpinner size={4} /> Analizando...</div>}
      {error && <p className="text-red-400 text-xs sm:text-sm bg-red-900/30 p-2 rounded">{error}</p>}
      {analysisData && !isLoading && !error && dataRenderer()}
    </div>
);

// --- Main Page Component ---
const AnalyticsPage: React.FC = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [otherInitiativesList, setOtherInitiativesList] = useState<OtherSustainabilityInitiative[]>([]);
  const [esgReportsList, setEsgReportsList] = useState<EsgReport[]>([]);
  const [certificationsList, setCertificationsList] = useState<Certification[]>([]);
  
  // Simulated data for charts and analysis
  const simulatedData = useMemo(() => getGenericSustainabilityData(), []);

  useEffect(() => {
    const loadData = async () => {
      setIsPageLoading(true);
      const [initiativesRes, reportsRes, certsRes] = await Promise.all([
        apiService.getData<OtherSustainabilityInitiative[]>('otherInitiatives'),
        apiService.getData<EsgReport[]>('esgReports'),
        apiService.getData<Certification[]>('certifications')
      ]);

      setOtherInitiativesList(initiativesRes.success && initiativesRes.data!.length > 0 ? initiativesRes.data! : initialOtherInitiativesData);
      if(initiativesRes.success && initiativesRes.data!.length === 0) apiService.initializeData('otherInitiatives', initialOtherInitiativesData);

      setEsgReportsList(reportsRes.success && reportsRes.data!.length > 0 ? reportsRes.data! : mockEsgReportsData);
      if(reportsRes.success && reportsRes.data!.length === 0) apiService.initializeData('esgReports', mockEsgReportsData);
      
      setCertificationsList(certsRes.success && certsRes.data!.length > 0 ? certsRes.data! : mockCertificationsData);
      if(certsRes.success && certsRes.data!.length === 0) apiService.initializeData('certifications', mockCertificationsData);

      setIsPageLoading(false);
    };
    loadData();
  }, []);

  // SAFE STATE UPDATE HANDLER for async AI analysis
  const handleInitiativeAnalysis = useCallback(async (initiativeId: string) => {
    const initiative = otherInitiativesList.find(i => i.id === initiativeId);
    if (!initiative) return;

    setOtherInitiativesList(prev => prev.map(i => i.id === initiativeId ? { ...i, isLoadingAI: true, errorAI: null, aiAnalysis: null } : i));

    try {
        const prompt = `Analiza el impacto de la iniciativa de sostenibilidad: "${initiative.title}" con la descripción: "${initiative.description}". Datos clave para el análisis: ${JSON.stringify(initiative.dataForAI)}. Considera beneficios, desafíos y sugiere un próximo paso clave. Responde estrictamente en formato JSON: {"impact_summary": "string", "challenges": ["string"], "next_steps_suggestions": ["string"]}`;
        const result = await geminiService.generateText(prompt, { responseMimeType: "application/json" });
        const parsedData = geminiService.parseJsonFromGeminiResponse<OtherInitiativeAIAnalysis>(result);

        if (!parsedData) throw new Error("Formato de respuesta de IA inválido.");

        let updatedList: OtherSustainabilityInitiative[] = [];
        setOtherInitiativesList(currentList => {
            updatedList = currentList.map(i => i.id === initiativeId ? { ...i, aiAnalysis: parsedData, isLoadingAI: false } : i);
            return updatedList;
        });
        await apiService.updateData('otherInitiatives', updatedList);
    } catch (err) {
        const errorMsg = err instanceof Error ? err.message : DEFAULT_ERROR_MESSAGE;
        let updatedList: OtherSustainabilityInitiative[] = [];
        setOtherInitiativesList(currentList => {
            updatedList = currentList.map(i => i.id === initiativeId ? { ...i, errorAI: errorMsg, isLoadingAI: false } : i);
            return updatedList;
        });
        await apiService.updateData('otherInitiatives', updatedList);
    }
  }, [otherInitiativesList]);

  // Similar safe handlers for ESG reports and Certifications...

  if (isPageLoading) {
    return <div className="text-center p-10 text-white"><LoadingSpinner /> Cargando análisis...</div>;
  }

  return (
    <div className="space-y-6 sm:space-y-8 text-[#a2abb3]">
      {/* Each section can be a component */}
      <section className={cardBaseStyle}>
        <h2 className={`${sectionTitleStyle} flex items-center`}>
          <LeafIcon className="h-6 w-6 sm:h-7 sm:w-7 mr-2 text-green-400" /> Huella de Carbono (Plataforma)
        </h2>
        {/* Carbon footprint content */}
      </section>

      <section className={cardBaseStyle}>
        <h2 className={`${sectionTitleStyle} flex items-center`}>
          <RouteIcon className="h-6 w-6 sm:h-7 sm:w-7 mr-2 text-blue-400" /> Impacto de Rutas Eco-Eficientes
        </h2>
        {/* Eco-routes content */}
      </section>

      <section className={cardBaseStyle}>
        <h2 className={`${sectionTitleStyle} flex items-center`}>
          <PackageIconPhosphor className="h-6 w-6 sm:h-7 sm:w-7 mr-2 text-purple-400" /> Reducción de Viajes en Vacío (Backhauls)
        </h2>
        {/* Backhauls content */}
      </section>

      <section className={cardBaseStyle}>
        <h2 className={`${sectionTitleStyle} flex items-center`}>
          <LeafIcon className="h-6 w-6 sm:h-7 sm:w-7 mr-2 text-teal-400" /> Otras Iniciativas de Sostenibilidad
        </h2>
        <div className="space-y-4 sm:space-y-6">
          {otherInitiativesList.map((initiative) => (
            <div key={initiative.id} className="p-3 sm:p-4 border border-[#40474f] rounded-xl bg-[#1f2328]">
              <h3 className="font-semibold text-white text-base sm:text-lg mb-1">{initiative.title}</h3>
              <p className="text-xs sm:text-sm text-[#a2abb3] mt-1 mb-2">{initiative.description}</p>
              <button 
                onClick={() => handleInitiativeAnalysis(initiative.id)} 
                disabled={initiative.isLoadingAI} 
                className={`${buttonPrimaryStyle} bg-teal-600 hover:bg-teal-700 w-full text-xs sm:text-sm`}>
                {initiative.isLoadingAI ? <LoadingSpinner size={5}/> : <ZapIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />}
                {initiative.isLoadingAI ? "Analizando..." : "Analizar Impacto con IA"}
              </button>
              <AIAnalysisSection
                isLoading={initiative.isLoadingAI || false} error={initiative.errorAI || null}
                analysisData={initiative.aiAnalysis || null} title={`Análisis IA: ${initiative.title}`}
                dataRenderer={() => initiative.aiAnalysis && (
                  <div className="text-xs sm:text-sm space-y-2 text-[#a2abb3]">
                      <p><strong>Impacto Resumido:</strong> <span className="text-white">{initiative.aiAnalysis.impact_summary}</span></p>
                  </div>
                )}
              />
            </div>
          ))}
        </div>
      </section>
      
      {/* ESG and Certifications Section */}
    </div>
  );
};

export default AnalyticsPage;