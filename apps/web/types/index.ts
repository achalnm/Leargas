// User Preferences

export type NumberFormat = 'western' | 'indian';

export interface UserPreferences {
  numberFormat: NumberFormat;
}

// Auth

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Dashboard

export type DataModule = 'housing' | 'employment' | 'weather';

export interface FilterState {
  county: string;
  startYear: number;
  endYear: number;
  chartType: 'line' | 'bar' | 'area';
}

export interface SavedDashboard {
  id: string;
  userId: string;
  name: string;
  module: DataModule;
  filters: FilterState;
  createdAt: string;
  updatedAt: string;
}

// Housing

export interface HousingDataPoint {
  year: number;
  quarter?: string;
  nationalMedianPrice: number;
  dublinMedianPrice: number;
  rentalIndexNational?: number;
}

export interface CountyHousingData {
  county: string;
  medianPrice: number;
  yoyChange: number;
  transactionCount: number;
}

export interface HousingStats {
  nationalMedianPrice: number;
  dublinMedianPrice: number;
  yoyChangeNational: number;
  yoyChangeDublin: number;
}

// Employment

export interface EmploymentDataPoint {
  year: number;
  quarter?: string;
  unemploymentRate: number;
  euAverageRate?: number;
}

export interface SectorEmploymentData {
  sector: string;
  employedThousands: number;
  percentageOfTotal: number;
}

export interface EmploymentStats {
  currentUnemploymentRate: number;
  euAverageRate: number;
  yoyChange: number;
  totalEmployed: number;
}

// Weather

export interface WeatherDataPoint {
  month: number;
  monthName: string;
  avgTemperatureC: number;
  rainfallMm: number;
  sunshinehours: number;
}

export interface CountyWeatherData {
  county: string;
  annualRainfallMm: number;
  avgTemperatureC: number;
  annualSunshineHours: number;
}

export interface WeatherStats {
  avgAnnualTemperature: number;
  avgAnnualRainfall: number;
  avgAnnualSunshine: number;
}

// API Responses

export interface ApiResponse<T> {
  data: T;
  lastUpdated: string;
  source: string;
}

export interface ApiError {
  message: string;
  code: string;
}

// Chart

export interface ChartDataPoint {
  [key: string]: string | number;
}

export type ChartColour = string;

export interface ChartConfig {
  [key: string]: {
    label: string;
    colour: ChartColour;
  };
}
