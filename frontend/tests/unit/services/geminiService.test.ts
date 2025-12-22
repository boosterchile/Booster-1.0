import { describe, it, expect } from 'vitest';
import { geminiService } from '../../../services/geminiService';

describe('geminiService', () => {
    describe('parseJsonFromGeminiResponse', () => {
        it('should parse valid JSON', () => {
            const jsonString = '{"key": "value", "number": 42}';
            const result = geminiService.parseJsonFromGeminiResponse(jsonString);

            expect(result).toEqual({ key: 'value', number: 42 });
        });

        it('should parse JSON with code fences', () => {
            const jsonString = '```json\\n{"key": "value"}\\n```';
            const result = geminiService.parseJsonFromGeminiResponse(jsonString);

            expect(result).toEqual({ key: 'value' });
        });

        it('should parse JSON with plain code fences', () => {
            const jsonString = '```\\n{"key": "value"}\\n```';
            const result = geminiService.parseJsonFromGeminiResponse(jsonString);

            expect(result).toEqual({ key: 'value' });
        });

        it('should handle whitespace around JSON', () => {
            const jsonString = '  \\n  {"key": "value"}  \\n  ';
            const result = geminiService.parseJsonFromGeminiResponse(jsonString);

            expect(result).toEqual({ key: 'value' });
        });

        it('should return null for invalid JSON', () => {
            const jsonString = '{invalid json}';
            const result = geminiService.parseJsonFromGeminiResponse(jsonString);

            expect(result).toBeNull();
        });

        it('should return null for empty string', () => {
            const result = geminiService.parseJsonFromGeminiResponse('');

            expect(result).toBeNull();
        });
    });

    // Note: generateText, generateRouteOptimizationSummary, and generateRiskAlertText
    // require API calls and should be mocked or tested in integration tests
    // Here we're only testing the pure utility function
});
