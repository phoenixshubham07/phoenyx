export interface MousePosition {
  x: number;
  y: number;
}

export enum PersonaType {
  AMATERASU = 'AMATERASU',
  INARI = 'INARI',
  RAIDEN = 'RAIDEN'
}

export interface PersonaData {
  id: PersonaType;
  name: string;
  title: string;
  description: string;
  features: string[];
  color: string;
  gradient: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}