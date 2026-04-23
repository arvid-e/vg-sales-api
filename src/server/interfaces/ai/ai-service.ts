export interface IAIService {
  generateVector(test: string): Promise<number[]>;
}
