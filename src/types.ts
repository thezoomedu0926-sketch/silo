/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Question {
  id: string;
  text: string;
  isReverse: boolean;
}

export interface Domain {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

export interface WorkshopPlan {
  activityName: string;
  duration: string;
  materials: string;
  process: string[];
  questionCards: string[];
}

export interface SiloDiagnosisData {
  diagnosisName: string;
  purpose: string;
  expectedEffects: string;
  domains: Domain[];
  workshopPlan: WorkshopPlan;
  qualityGuide: string[];
}

export type RiskLevel = 'Healthy Synergy' | 'Potential Silo' | 'Silo Caution' | 'Silo Red Alert';

export interface DiagnosisResult {
  totalScore: number;
  domainScores: Record<string, number>;
  riskLevel: RiskLevel;
  description: string;
}
