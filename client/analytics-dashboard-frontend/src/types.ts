// src/types.ts
export interface Event {
    type: 'userActivity' | 'systemLog' | 'errorReport';
    data: string;
  }
  