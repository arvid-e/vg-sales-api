import { pipeline } from '@xenova/transformers';
import type { IAIService } from '../interfaces/ai/ai-service.js';

export class AIService implements IAIService {
  private extractor: any;

  constructor() {
    this.init();
  }

  private async init() {
    this.extractor = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2'
    );
  }

  /**
   * Generates a normalized numerical vector (embedding) from text using 
   * a pre-trained feature extraction pipeline.
   */
  async generateVector(text: string): Promise<number[]> {
    if (!this.extractor) await this.init();

    const output = await this.extractor(text, {
      pooling: 'mean',
      normalize: true,
    });
    return Array.from(output.data);
  }
}
