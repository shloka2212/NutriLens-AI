
export interface Nutrient {
  value: number;
  unit: string;
}

export interface NutritionData {
  dishName: string;
  servingSize: string;
  calories: number;
  carbohydrates: Nutrient;
  protein: Nutrient;
  fat: Nutrient;
  fiber: Nutrient;
  sugar: Nutrient;
  sodium: Nutrient;
  description: string;
  healthRating: number; // 1-10
  allergens: string[];
}

export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}
