import type { WeatherDataPoint, CountyWeatherData, WeatherStats, ApiResponse } from '@/types';

export async function fetchWeatherMonthly(): Promise<ApiResponse<WeatherDataPoint[]>> {
  const res = await fetch('/api/data/weather', { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error('Failed to fetch weather data');
  return res.json() as Promise<ApiResponse<WeatherDataPoint[]>>;
}

export async function fetchWeatherByCounty(): Promise<ApiResponse<CountyWeatherData[]>> {
  const res = await fetch('/api/data/weather/county', { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error('Failed to fetch county weather data');
  return res.json() as Promise<ApiResponse<CountyWeatherData[]>>;
}

export function computeWeatherStats(data: WeatherDataPoint[]): WeatherStats {
  if (data.length === 0) {
    return { avgAnnualTemperature: 0, avgAnnualRainfall: 0, avgAnnualSunshine: 0 };
  }
  const avgTemp = data.reduce((s, d) => s + d.avgTemperatureC, 0) / data.length;
  const totalRain = data.reduce((s, d) => s + d.rainfallMm, 0);
  const totalSun = data.reduce((s, d) => s + d.sunshinehours, 0);
  return {
    avgAnnualTemperature: parseFloat(avgTemp.toFixed(1)),
    avgAnnualRainfall: parseFloat(totalRain.toFixed(0)),
    avgAnnualSunshine: parseFloat(totalSun.toFixed(0)),
  };
}
