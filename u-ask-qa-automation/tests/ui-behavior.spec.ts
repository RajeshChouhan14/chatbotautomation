import { test, expect } from '@playwright/test';
import { openChatWidget, selectors, sendMessage, waitForAIResponse } from '../utils/chatbot-helpers';

test.describe('U-Ask Chatbot UI Behavior', () => {

  test('Chat widget loads correctly on desktop', async ({ page }) => {
    await page.goto('');
    const frame = page.frameLocator(selectors.chatWidgetFrame).first();
    await expect(frame.locator(selectors.messagesContainer)).toBeVisible();
  });

  test('Chat widget loads correctly on mobile', async ({ page }) => {
    // Mobile viewport is defined in project (iPhone 13), so we just verify
    await page.goto('');
    const frame = page.frameLocator(selectors.chatWidgetFrame).first();
    await expect(frame.locator(selectors.messagesContainer)).toBeVisible();
  });

  test('User can send messages and AI response is rendered', async ({ page }) => {
    const frame = await openChatWidget(page);

    const message = 'Hello, I need help with my Emirates ID.';
    const input = frame.locator(selectors.input);

    await input.fill(message);
    await frame.locator(selectors.sendButton).click();

    // User message appears
    await expect(frame.locator(selectors.userMessageBubble).last()).toContainText(message);

    // AI responds
    const response = await waitForAIResponse(frame);
    expect(response.length).toBeGreaterThan(10);

    // Input cleared
    await expect(input).toHaveValue('');
  });

  test('Multilingual support: English is LTR, Arabic is RTL', async ({ page }) => {
    const frame = await openChatWidget(page);

    // English
    await sendMessage(frame, 'Hello, how can I renew my UAE passport?');
    await waitForAIResponse(frame);

    const lastAiBubbleEn = frame.locator(selectors.aiMessageBubble).last();
    const dirEn = await lastAiBubbleEn.getAttribute('dir');
    // Some apps may not set dir attribute; you can also check CSS direction
    expect(dirEn === null || dirEn.toLowerCase() === 'ltr').toBeTruthy();

    // Arabic
    await sendMessage(frame, 'مرحبا، كيف يمكنني تجديد جواز السفر الإماراتي؟');
    await waitForAIResponse(frame);

    const lastAiBubbleAr = frame.locator(selectors.aiMessageBubble).last();
    const dirAr = await lastAiBubbleAr.getAttribute('dir');
    expect(dirAr?.toLowerCase()).toBe('rtl');
  });

  test('Scroll behavior: conversation area scrolls when messages overflow', async ({ page }) => {
    const frame = await openChatWidget(page);
    const container = frame.locator(selectors.messagesContainer);

    // Send multiple messages to overflow
    for (let i = 0; i < 6; i++) {
      await sendMessage(frame, `Test message ${i}`);
      await waitForAIResponse(frame);
    }

    const scrollHeight = await container.evaluate((el) => el.scrollHeight);
    const clientHeight = await container.evaluate((el) => el.clientHeight);
    expect(scrollHeight).toBeGreaterThan(clientHeight);

    // Ensure we are auto-scrolling to bottom
    const scrollTop = await container.evaluate((el) => el.scrollTop);
    expect(scrollTop).toBeGreaterThan(0);
  });

    test('Accessibility: input has accessible name and roles', async ({ page }) => {
    const frame = await openChatWidget(page);

    const input = frame.locator(selectors.input);

    // Check at least one of aria-label / aria-labelledby exists and mentions chat/message
    const hasMeaningfulAria = await input.evaluate(el => {
      const e = el as HTMLElement;
      const ariaLabel = e.getAttribute('aria-label') || '';
      const ariaLabelledBy = e.getAttribute('aria-labelledby') || '';
      const combined = (ariaLabel + ' ' + ariaLabelledBy).toLowerCase();
      return combined.includes('chat') || combined.includes('message');
    });
    expect(hasMeaningfulAria).toBeTruthy();

    const sendButton = frame.locator(selectors.sendButton);
    // if explicit role is set, it should be 'button' – otherwise native <button> is fine
    const role = await sendButton.getAttribute('role');
    if (role) {
      expect(role.toLowerCase()).toBe('button');
    }
  });

  test('Loading states: typing indicator hides after response is ready', async ({ page }) => {
    const frame = await openChatWidget(page);

    await sendMessage(frame, 'Please help me with a general question.');

    // Wait for AI response (this implicitly waits for the conversation to update)
    await waitForAIResponse(frame);

    // After response is ready, typing indicator should be hidden
    await expect(frame.locator(selectors.typingIndicator)).toBeHidden();
  });


});
