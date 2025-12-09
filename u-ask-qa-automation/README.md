# U-Ask – AI/ML QA Automation

This project contains end-to-end automated tests for **U-Ask**, the UAE Government generative AI chatbot.
# U-Ask – AI/ML QA Automation

This project contains end-to-end automated tests for **U-Ask**, the UAE Government generative AI chatbot.

It validates:

- **Chatbot UI behavior** (desktop + mobile)
- **GPT-powered responses** (quality, hallucinations, multilingual consistency)
- **Security & injection handling** (XSS, prompt injection, system override)

Because the real U-Ask environment is not publicly accessible, this project also includes a **local mock chatbot UI** that mimics the expected DOM and behavior so the automation can be demonstrated end-to-end.

---

## 1. Project Structure

```text
u-ask-qa-automation/
├─ package.json
├─ playwright.config.ts
├─ README.md
├─ test-data.json
├─ tests/
│  ├─ ui-behavior.spec.ts
│  ├─ ai-responses.spec.ts
│  └─ security.spec.ts
├─ utils/
│  └─ chatbot-helpers.ts
└─ u-ask-mock-chatbot/
   ├─ index.html          # host page with iframe
   ├─ widget.html         # chatbot widget UI
   ├─ chatbot.js          # mock AI behavior
   └─ styles.css

It validates:

- **Chatbot UI behavior** (desktop + mobile)
- **GPT-powered responses** (quality, hallucinations, multilingual consistency)
- **Security & injection handling** (XSS, prompt injection)

---

## Tech Stack

- [Playwright](https://playwright.dev/) – browser automation
- TypeScript – test implementation
- `test-data.json` – centralized prompts and expectations

---

## Setup

1. **Install dependencies**

```bash
npm install
npx playwright install
