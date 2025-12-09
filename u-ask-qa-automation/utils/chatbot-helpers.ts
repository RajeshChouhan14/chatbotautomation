import { FrameLocator, Page, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export type TestLanguage = 'en' | 'ar';

export function getTestLanguage(): TestLanguage | 'all' {
  const lang = (process.env.TEST_LANG || 'all').toLowerCase();
  if (lang === 'en' || lang === 'ar' || lang === 'all') return lang as any;
  return 'all';
}

export interface TestData {
  languages: string[];
  commonPublicServiceQueries: any[];
  formattingChecks: {
    forbiddenSubstrings: string[];
  };
  securityPrompts: any[];
  fallbackScenarios: any[];
}

export function loadTestData(): TestData {
  const filePath = path.join(__dirname, '..', 'test-data.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as TestData;
}

/**
 * Adjust these selectors to match the real U-Ask implementation.
 */
export const selectors = {
  chatWidgetFrame: 'iframe#u-ask-widget, iframe[title*="U-Ask"]',
  chatOpenButton: 'button[data-testid="open-chat"], button[aria-label*="U-Ask"]',
  input: 'textarea[data-testid="chat-input"], input[data-testid="chat-input"]',
  sendButton: 'button[data-testid="send-button"]',
  messagesContainer: '[data-testid="messages-container"]',
  // Use class names instead of data-testid for bubbles
  userMessageBubble: '.message.user .bubble',
  aiMessageBubble: '.message.ai .bubble',
  typingIndicator: '[data-testid="typing-indicator"]',
  fallbackMessage: '[data-testid="fallback-message"], text=/Sorry, please try again|من فضلك حاول مرة أخرى/i'
};

export async function openChatWidget(page: Page): Promise<FrameLocator> {
  await page.goto('/');
  const frameLocator = page.frameLocator(selectors.chatWidgetFrame).first();

  const openButton = frameLocator.locator(selectors.chatOpenButton);
  if (await openButton.isVisible().catch(() => false)) {
    await openButton.click();
  }

  await expect(frameLocator.locator(selectors.messagesContainer)).toBeVisible();
  return frameLocator;
}

export async function sendMessage(
  frame: FrameLocator,
  message: string
) {
  const input = frame.locator(selectors.input);
  await input.fill(message);
  await frame.locator(selectors.sendButton).click();
}

export async function waitForAIResponse(
  frame: FrameLocator
): Promise<string> {
  const container = frame.locator(selectors.messagesContainer);
  const aiBubble = container.locator(selectors.aiMessageBubble).last();
  await expect(aiBubble).toBeVisible();
  const text = await aiBubble.innerText();
  return text.trim();
}
