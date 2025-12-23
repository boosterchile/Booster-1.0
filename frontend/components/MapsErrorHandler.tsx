import React from 'react';
import { useApiLoadingStatus, APILoadingStatus } from '@vis.gl/react-google-maps';
import { AlertTriangleIcon, WarningCircleIcon } from './icons';

const MapsErrorHandler: React.FC = () => {
    const status = useApiLoadingStatus();

    if (status === APILoadingStatus.AUTH_FAILURE) {
        return (
            <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full bg-[#1a1f25] border-l-4 border-red-500 rounded-md shadow-2xl p-4 animate-slide-in-right">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <WarningCircleIcon className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-400">Error de Autenticación de Mapas</h3>
                        <div className="mt-1 text-sm text-[#a2abb3]">
                            <p>Google Maps no pudo autenticarse. Por favor verifica:</p>
                            <ul className="list-disc leading-5 pl-5 mt-1 space-y-1 text-xs">
                                <li>La API "Maps JavaScript API" está habilitada en Google Cloud.</li>
                                <li>La cuenta de facturación está activa.</li>
                                <li>Las restricciones de la API Key permiten este dominio.</li>
                            </ul>
                        </div>
                        <div className="mt-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
                            >
                                Reintentar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (status === APILoadingStatus.FAILED) {
        return (
            <div className="fixed bottom-4 right-4 z-50 max-w-md w-full bg-[#1a1f25] border-l-4 border-yellow-500 rounded-md shadow-2xl p-4 animate-slide-in-right">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-500">Problema de Conexión con Mapas</h3>
                        <div className="mt-2 text-sm text-[#a2abb3]">
                            <p>No se pudo cargar Google Maps. Revisa tu conexión a internet o si algún bloqueador (adblocker) está interfiriendo.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default MapsErrorHandler;
