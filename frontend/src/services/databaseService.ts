import { config } from '../config';
import { FrequencyData } from '../types';
import { BarChartData } from '../components/BarChart';

// Define common fetch options to handle CORS
const fetchOptions = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  mode: 'cors' as RequestMode
};

export const getFrequencyRatings = async (school?: string): Promise<FrequencyData[]> => {
  try {
    const url = school 
      ? `${config.api.baseUrl}/api/frequency-ratings?school=${encodeURIComponent(school)}`
      : `${config.api.baseUrl}/api/frequency-ratings`;
    
    console.log('Fetching frequency ratings from:', url);
    
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    
    const data: FrequencyData[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching frequency ratings:', error);
    throw error;
  }
};

export const getYearsDistribution = async (school: string): Promise<BarChartData[]> => {
  try {
    const url = `${config.api.baseUrl}/api/years-distribution?school=${encodeURIComponent(school)}`;
    
    console.log('Fetching years distribution from:', url);
    
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching years distribution:', error);
    throw error;
  }
};

export const getYearsDistributionForEstudiantes = async (school: string): Promise<BarChartData[]> => {
  try {
    const url = `${config.api.baseUrl}/api/estudiantes-years-distribution?school=${encodeURIComponent(school)}`;
    
    console.log('Fetching estudiantes years distribution from:', url);
    
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching estudiantes years distribution:', error);
    throw error;
  }
};

export const getFeedbackDistribution = async (school: string): Promise<BarChartData[]> => {
  try {
    const url = `${config.api.baseUrl}/api/feedback-distribution?school=${encodeURIComponent(school)}`;
    
    console.log('Fetching feedback distribution from:', url);
    
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching feedback distribution:', error);
    throw error;
  }
};

export const getScheduleDistributionForEstudiantes = async (school: string): Promise<BarChartData[]> => {
  try {
    const url = `${config.api.baseUrl}/api/schedule-distribution-estudiantes?school=${encodeURIComponent(school)}`;
    
    console.log('Fetching estudiantes schedule distribution from:', url);
    
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching estudiantes schedule distribution:', error);
    throw error;
  }
};

export const getGradosEstudiantesDistribution = async (school: string): Promise<BarChartData[]> => {
  try {
    const url = `${config.api.baseUrl}/api/grados-acudientes-distribution?school=${encodeURIComponent(school)}`;
    
    console.log('Fetching acudientes grades distribution from:', url);
    
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching acudientes grades distribution:', error);
    throw error;
  }
};

export const getScheduleDistributionForDocentes = async (school: string): Promise<BarChartData[]> => {
  try {
    const url = `${config.api.baseUrl}/api/schedule-distribution-docentes?school=${encodeURIComponent(school)}`;
    
    console.log('Fetching docentes schedule distribution from:', url);
    
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching docentes schedule distribution:', error);
    throw error;
  }
};

export interface SchoolRanking {
  rank: number;
  school: string;
  totalResponses: number;
  averageScore: number;
  percentageScore: number;
  ratings: {
    siempre: number;
    casi_siempre: number;
    a_veces: number;
    casi_nunca: number;
    nunca: number;
  };
}

export interface SchoolRankingsResponse {
  message: string;
  rankings: SchoolRanking[];
}

export const getSchoolRankings = async (): Promise<SchoolRanking[]> => {
  try {
    const url = `${config.api.baseUrl}/api/schools-ranking`;
    
    console.log('Fetching school rankings from:', url);
    
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`Failed to fetch rankings: ${response.status} ${response.statusText}`);
    }
    
    const result: SchoolRankingsResponse = await response.json();
    return result.rankings;
  } catch (error) {
    console.error('Error fetching school rankings:', error);
    throw error;
  }
}; 