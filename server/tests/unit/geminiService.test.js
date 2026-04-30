import { describe, it, expect, vi } from 'vitest';
import { getChatResponse } from '../../src/services/geminiService.js';
import * as geminiConfig from '../../src/config/gemini.js';

// Mock the Gemini config
vi.mock('../../src/config/gemini.js', () => ({
  isAIAvailable: vi.fn(),
  model: {
    startChat: vi.fn(),
    generateContent: vi.fn(),
  },
}));

describe('Gemini Service', () => {
  it('should return fallback response when AI is not available', async () => {
    vi.mocked(geminiConfig.isAIAvailable).mockReturnValue(false);
    
    const response = await getChatResponse('How do I register?');
    expect(response).toContain('Voter Registration');
  });

  it('should call Gemini API when available', async () => {
    vi.mocked(geminiConfig.isAIAvailable).mockReturnValue(true);
    
    const mockSendMessage = vi.fn().mockResolvedValue({
      response: { text: () => 'Mock AI Response' }
    });
    
    vi.mocked(geminiConfig.model.startChat).mockReturnValue({
      sendMessage: mockSendMessage
    });
    
    const response = await getChatResponse('Test message');
    expect(response).toBe('Mock AI Response');
    expect(mockSendMessage).toHaveBeenCalledWith('Test message');
  });
});
