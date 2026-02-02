import { useState } from 'react';
import { TemperatureChart } from './TemperatureChart';
import { PrecipitationChart } from './PrecipitationChart';
import type { ForecastData } from '../types/forecast';

interface WeatherChartsProps {
    forecast: ForecastData;
}

export const WeatherCharts = ({ forecast }: WeatherChartsProps) => {
    const [activeChart, setActiveChart] = useState<'temperature' | 'precipitation'>('temperature');

    return (
        <div className="card-dark-elevated p-6 space-y-4 animate-fade-in">
            <h3 className="text-xl font-bold text-white text-center">Weather Trends</h3>

            {/* Chart Tabs */}
            <div className="flex gap-2">
                <button
                    onClick={() => setActiveChart('temperature')}
                    className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${activeChart === 'temperature'
                            ? 'bg-[var(--accent-cyan)] text-[#0a0e27] glow-cyan'
                            : 'bg-[var(--bg-input)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                        }`}
                >
                    🌡️ Temperature
                </button>
                <button
                    onClick={() => setActiveChart('precipitation')}
                    className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${activeChart === 'precipitation'
                            ? 'bg-[var(--accent-cyan)] text-[#0a0e27] glow-cyan'
                            : 'bg-[var(--bg-input)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                        }`}
                >
                    💧 Precipitation
                </button>
            </div>

            {/* Chart Display */}
            <div className="mt-4">
                {activeChart === 'temperature' ? (
                    <TemperatureChart forecast={forecast} />
                ) : (
                    <PrecipitationChart forecast={forecast} />
                )}
            </div>
        </div>
    );
};
