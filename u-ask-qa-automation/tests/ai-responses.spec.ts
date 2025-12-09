import { test, expect } from '@playwright/test';
import { openChatWidget, loadTestData, getTestLanguage, selectors, waitForAIResponse, sendMessage } from '../utils/chatbot-helpers';

const data = loadTestData();
const configuredLang = getTestLanguage();

function languagesToTest(): ('en' | 'ar')[] {
  if (configuredLang === 'all') return ['en', 'ar'];
  return [configuredLang];
}

test.describe('U-Ask GPT-powered response validation', () => {

  for (const lang of languagesToTest()) {
    test.describe(`${lang.toUpperCase()} responses`, () => {

      for (const query of data.commonPublicServiceQueries) {
        const ld = query.languageData[lang];

        test(`Intent "${query.id}" returns clear, helpful and non-hallucinated ${lang.toUpperCase()} response`, async ({ page }) => {
          const frame = await openChatWidget(page);

          await sendMessage(frame, ld.prompt);
          const response = await waitForAIResponse(frame);

          // Basic sanity checks
          expect(response.length).toBeGreaterThan(ld.minLength);

          // Must include required keywords
          for (const keyword of ld.mustIncludeKeywords) {
            expect(response.toLowerCase()).toContain(keyword.toLowerCase());
          }

          // Avoid hallucination keywords
          for (const forbidden of ld.forbiddenHallucinationKeywords) {
            expect(response.toLowerCase()).not.toContain(forbidden.toLowerCase());
          }

          // Formatting checks
          for (const forbidden of data.formattingChecks.forbiddenSubstrings) {
            expect(response).not.toContain(forbidden);
          }

          // No incomplete thought heuristics
          const trimmed = response.trim();
          expect(trimmed.endsWith('.') || trimmed.endsWith('؟') || trimmed.endsWith('!') || trimmed.endsWith('!')).toBeTruthy();
        });
      }

      test(`Fallback message shown for nonsense query in ${lang.toUpperCase()}`, async ({ page }) => {
        const frame = await openChatWidget(page);

        const fallbackCase = data.fallbackScenarios.find(f => f.id === 'nonsense_query');
        const ld = fallbackCase.languageData[lang];

        await sendMessage(frame, ld.prompt);
        const response = await waitForAIResponse(frame);

        if (ld.fallbackExpected) {
          await expect(frame.locator(selectors.fallbackMessage)).toBeVisible();
        }

        // Even fallback should not leak internal errors
        expect(response.toLowerCase()).not.toMatch(/stack trace|exception|error 500/);
      });

    });
  }

  test('Consistency: same intent in English and Arabic remains aligned', async ({ page }) => {
    const frame = await openChatWidget(page);

    const intent = data.commonPublicServiceQueries[0]; // e.g. passport_renewal

    // English
    await sendMessage(frame, intent.languageData.en.prompt);
    const enResponse = await waitForAIResponse(frame);

    // Arabic
    await sendMessage(frame, intent.languageData.ar.prompt);
    const arResponse = await waitForAIResponse(frame);

    // Very simple heuristic: both should mention same "concept" words
    const coreTokens = ['passport', 'جواز', 'renew', 'تجديد'];
    let enHit = 0;
    let arHit = 0;
    if (enResponse.toLowerCase().includes('passport')) enHit++;
    if (enResponse.toLowerCase().includes('renew')) enHit++;
    if (arResponse.includes('جواز')) arHit++;
    if (arResponse.includes('تجديد')) arHit++;

    expect(enHit).toBeGreaterThan(0);
    expect(arHit).toBeGreaterThan(0);
  });

});
