import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ForecastData } from '../types/forecast';

interface PrecipitationChartProps {
    forecast: ForecastData;
}

export const PrecipitationChart = ({ forecast }: PrecipitationChartProps) => {
    const data = forecast.daily.time.map((date, index) => ({
        day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        precipitation: forecast.daily.precipitation_sum[index],
    }));

    // Check if there's any precipitation
    const hasRain = data.some(item => item.precipitation > 0);

    if (!hasRain) {
        return (
            <div className="text-center text-[var(--text-secondary)] py-12">
                <div className="text-6xl mb-4">☀️</div>
                <p className="text-lg text-white">No precipitation expected</p>
                <p className="text-sm mt-2">Clear skies ahead!</p>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorPrecip" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#00d4ff" stopOpacity={0.3} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis
                    dataKey="day"
                    stroke="#94a3b8"
                    style={{ fontSize: '12px' }}
                />
                <YAxis
                    stroke="#94a3b8"
                    style={{ fontSize: '12px' }}
                    label={{ value: 'mm', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1a1d2e',
                        border: '1px solid rgba(0, 212, 255, 0.3)',
                        borderRadius: '12px',
                        color: '#fff',
                        boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)'
                    }}
                    labelStyle={{ color: '#00d4ff', fontWeight: 'bold' }}
                    formatter={(value: number | undefined) => value !== undefined ? [`${value.toFixed(1)} mm`, 'Precipitation'] : ['0 mm', 'Precipitation']}
                />
                <Bar
                    dataKey="precipitation"
                    fill="url(#colorPrecip)"
                    radius={[8, 8, 0, 0]}
                    name="Precipitation"
                />
            </BarChart>
        </ResponsiveContainer>
    );
};
