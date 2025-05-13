import { Request, Response } from 'express';

// Main data types
export interface FrequencyResult {
  S: number;
  A: number;
  N: number;
}

export interface QuestionMappings {
  docentes: string;
  estudiantes: string;
  acudientes: string;
}

export interface GridItem {
  displayText: string;
  questionMappings: QuestionMappings;
  results: {
    docentes: FrequencyResult;
    estudiantes: FrequencyResult;
    acudientes: FrequencyResult;
  };
}

export interface FrequencyData {
  title: string;
  questions: GridItem[];
}

export interface SectionConfig {
  title: string;
  items: {
    displayText: string;
    questionMappings: QuestionMappings;
  }[];
}

export interface SchoolMonitoringData {
  schoolName: string;
  rectorName: string;
  currentPosition: string;
  personalEmail: string;
  institutionalEmail: string;
  personalPhone: string;
  institutionalPhone: string;
  preferredContact: string;
  submissions: {
    docentes: number;
    estudiantes: number;
    acudientes: number;
  };
  meetingRequirements: boolean;
}

export interface PieChartData {
  label: string;
  value: number;
  color: string;
}

export interface BarChartData {
  label: string;
  value: number;
  color: string;
} 