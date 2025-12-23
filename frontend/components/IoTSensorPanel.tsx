import React from 'react';
import { ThermometerIcon, MapPinIcon, AlertTriangleIcon } from './icons';

interface SensorReading {
    sensorType: string;
    value: number;
    unit: string;
    timestamp: string;
    latitude?: number;
    longitude?: number;
}

interface IoTSensorPanelProps {
    readings: Record<string, SensorReading>;
    isLoading?: boolean;
    onSimulate?: () => void;
    isSimulating?: boolean;
}

const SensorCard: React.FC<{
    title: string;
    value: string;
    unit: string;
    icon: React.ReactNode;
    status?: 'normal' | 'warning' | 'critical';
    timestamp?: string;
}> = ({ title, value, unit, icon, status = 'normal', timestamp }) => {
    const statusColors = {
        normal: 'border-emerald-500/30 bg-emerald-500/10',
        warning: 'border-yellow-500/30 bg-yellow-500/10',
        critical: 'border-red-500/30 bg-red-500/10',
    };

    const valueColors = {
        normal: 'text-emerald-400',
        warning: 'text-yellow-400',
        critical: 'text-red-400',
    };

    return (
        <div className={`rounded-lg border p-4 ${statusColors[status]}`}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-[#a2abb3] text-sm">{title}</span>
                <div className="text-[#a2abb3]/60">{icon}</div>
            </div>
            <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-bold ${valueColors[status]}`}>{value}</span>
                <span className="text-[#a2abb3]/60 text-sm">{unit}</span>
            </div>
            {timestamp && (
                <div className="text-[#a2abb3]/40 text-xs mt-2">
                    {new Date(timestamp).toLocaleTimeString()}
                </div>
            )}
        </div>
    );
};

const IoTSensorPanel: React.FC<IoTSensorPanelProps> = ({
    readings,
    isLoading = false,
    onSimulate,
    isSimulating = false,
}) => {
    const getTemperatureStatus = (temp: number): 'normal' | 'warning' | 'critical' => {
        if (temp < 0 || temp > 10) return 'critical';
        if (temp < 2 || temp > 8) return 'warning';
        return 'normal';
    };

    const getVibrationStatus = (level: number): 'normal' | 'warning' | 'critical' => {
        if (level > 70) return 'critical';
        if (level > 30) return 'warning';
        return 'normal';
    };

    if (isLoading) {
        return (
            <div className="bg-[#2c3035] rounded-xl p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-[#3c4045] rounded w-1/3"></div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-24 bg-[#3c4045] rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const tempReading = readings['TEMPERATURE'];
    const humidityReading = readings['HUMIDITY'];
    const locationReading = readings['LOCATION'];
    const vibrationReading = readings['VIBRATION'];
    const doorReading = readings['DOOR_STATUS'];

    return (
        <div className="bg-[#2c3035] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#f0f2f5]">
                    📡 Datos IoT en Tiempo Real
                </h3>
                {onSimulate && (
                    <button
                        onClick={onSimulate}
                        disabled={isSimulating}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isSimulating
                                ? 'bg-[#3c4045] text-[#a2abb3]/50 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg'
                            }`}
                    >
                        {isSimulating ? 'Simulando...' : '🎮 Simular Sensores'}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <SensorCard
                    title="Temperatura"
                    value={tempReading ? tempReading.value.toFixed(1) : '--'}
                    unit="°C"
                    icon={<ThermometerIcon className="w-5 h-5" />}
                    status={tempReading ? getTemperatureStatus(tempReading.value) : 'normal'}
                    timestamp={tempReading?.timestamp}
                />

                <SensorCard
                    title="Humedad"
                    value={humidityReading ? humidityReading.value.toFixed(0) : '--'}
                    unit="%"
                    icon={<span>💧</span>}
                    status="normal"
                    timestamp={humidityReading?.timestamp}
                />

                <SensorCard
                    title="Velocidad"
                    value={locationReading ? locationReading.value.toFixed(0) : '--'}
                    unit="km/h"
                    icon={<MapPinIcon className="w-5 h-5" />}
                    status="normal"
                    timestamp={locationReading?.timestamp}
                />

                <SensorCard
                    title="Vibración"
                    value={vibrationReading ? vibrationReading.value.toFixed(0) : '--'}
                    unit="nivel"
                    icon={<span>📳</span>}
                    status={vibrationReading ? getVibrationStatus(vibrationReading.value) : 'normal'}
                    timestamp={vibrationReading?.timestamp}
                />

                <SensorCard
                    title="Puerta"
                    value={doorReading ? (doorReading.value === 1 ? 'Abierta' : 'Cerrada') : '--'}
                    unit=""
                    icon={doorReading?.value === 1 ? <AlertTriangleIcon className="w-5 h-5" /> : <span>🚪</span>}
                    status={doorReading?.value === 1 ? 'critical' : 'normal'}
                    timestamp={doorReading?.timestamp}
                />
            </div>

            {locationReading?.latitude && locationReading?.longitude && (
                <div className="mt-4 text-sm text-[#a2abb3]/60">
                    📍 Última ubicación: {locationReading.latitude.toFixed(4)}, {locationReading.longitude.toFixed(4)}
                </div>
            )}
        </div>
    );
};

export default IoTSensorPanel;
