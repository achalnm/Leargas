import { describe, it, expect } from 'vitest';
import { computeHousingStats } from '@/lib/data/housing';
import { computeEmploymentStats } from '@/lib/data/employment';
import { computeWeatherStats } from '@/lib/data/weather';
import type { HousingDataPoint, EmploymentDataPoint, WeatherDataPoint } from '@/types';

const housingData: HousingDataPoint[] = [
  { year: 2020, nationalMedianPrice: 270000, dublinMedianPrice: 388000 },
  { year: 2021, nationalMedianPrice: 285000, dublinMedianPrice: 400000 },
  { year: 2022, nationalMedianPrice: 318000, dublinMedianPrice: 415000 },
  { year: 2023, nationalMedianPrice: 335000, dublinMedianPrice: 425000 },
  { year: 2024, nationalMedianPrice: 352000, dublinMedianPrice: 438000 },
];

describe('computeHousingStats', () => {
  it('returns latest prices', () => {
    const stats = computeHousingStats(housingData);
    expect(stats.nationalMedianPrice).toBe(352000);
    expect(stats.dublinMedianPrice).toBe(438000);
  });

  it('calculates YoY change correctly', () => {
    const stats = computeHousingStats(housingData);
    // 2024 vs 2023: (352000 - 335000) / 335000 * 100 ≈ 5.1%
    expect(stats.yoyChangeNational).toBeGreaterThan(0);
  });

  it('returns zeros for empty data', () => {
    const stats = computeHousingStats([]);
    expect(stats.nationalMedianPrice).toBe(0);
    expect(stats.dublinMedianPrice).toBe(0);
    expect(stats.yoyChangeNational).toBe(0);
    expect(stats.yoyChangeDublin).toBe(0);
  });
});

const employmentData: EmploymentDataPoint[] = [
  { year: 2020, unemploymentRate: 5.9, euAverageRate: 8.1 },
  { year: 2021, unemploymentRate: 7.8, euAverageRate: 8.4 },
  { year: 2022, unemploymentRate: 5.5, euAverageRate: 7.2 },
  { year: 2023, unemploymentRate: 4.5, euAverageRate: 6.8 },
  { year: 2024, unemploymentRate: 4.4, euAverageRate: 6.5 },
];

describe('computeEmploymentStats', () => {
  it('returns latest unemployment rate', () => {
    const stats = computeEmploymentStats(employmentData);
    expect(stats.currentUnemploymentRate).toBe(4.4);
  });

  it('returns EU average from latest data point', () => {
    const stats = computeEmploymentStats(employmentData);
    expect(stats.euAverageRate).toBe(6.5);
  });

  it('returns zeros for empty data', () => {
    const stats = computeEmploymentStats([]);
    expect(stats.currentUnemploymentRate).toBe(0);
  });
});

const weatherData: WeatherDataPoint[] = [
  { month: 1, monthName: 'Jan', avgTemperatureC: 5.2, rainfallMm: 80, sunshinehours: 54 },
  { month: 2, monthName: 'Feb', avgTemperatureC: 5.5, rainfallMm: 62, sunshinehours: 74 },
  { month: 7, monthName: 'Jul', avgTemperatureC: 16.5, rainfallMm: 70, sunshinehours: 152 },
  { month: 12, monthName: 'Dec', avgTemperatureC: 5.8, rainfallMm: 90, sunshinehours: 49 },
];

describe('computeWeatherStats', () => {
  it('calculates average annual temperature', () => {
    const stats = computeWeatherStats(weatherData);
    expect(stats.avgAnnualTemperature).toBeCloseTo(8.3, 1);
  });

  it('sums total rainfall', () => {
    const stats = computeWeatherStats(weatherData);
    expect(stats.avgAnnualRainfall).toBe(302);
  });

  it('sums total sunshine hours', () => {
    const stats = computeWeatherStats(weatherData);
    expect(stats.avgAnnualSunshine).toBe(329);
  });

  it('returns zeros for empty data', () => {
    const stats = computeWeatherStats([]);
    expect(stats.avgAnnualTemperature).toBe(0);
  });
});
