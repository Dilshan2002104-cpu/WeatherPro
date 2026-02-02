import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ForecastData } from '../types/forecast';

interface TemperatureChartProps {
    forecast: ForecastData;
}

export const TemperatureChart = ({ forecast }: TemperatureChartProps) => {
    const data = forecast.daily.time.map((date, index) => ({
        day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        max: Math.round(forecast.daily.temperature_2m_max[index]),
        min: Math.round(forecast.daily.temperature_2m_min[index]),
    }));

    return (
        <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
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
                    label={{ value: '°C', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
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
                />
                <Area
                    type="monotone"
                    dataKey="max"
                    stroke="#00d4ff"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorMax)"
                    name="High"
                />
                <Area
                    type="monotone"
                    dataKey="min"
                    stroke="#a855f7"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorMin)"
                    name="Low"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};
