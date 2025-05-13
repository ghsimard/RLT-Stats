// Type definitions for cosmoStats types
export interface FrequencyResult {
  S: number;
  A: number;
  N: number;
}

export interface GridItem {
  displayText: string;
  questionMappings: {
    docentes: string;
    estudiantes: string;
    acudientes: string;
  };
  results?: {
    docentes: FrequencyResult;
    estudiantes: FrequencyResult;
    acudientes: FrequencyResult;
  };
}

export interface SectionConfig {
  title: string;
  items: {
    displayText: string;
    questionMappings: {
      docentes: string;
      estudiantes: string;
      acudientes: string;
    };
  }[];
}

export interface FrequencyData {
  title: string;
  questions: GridItem[];
} 