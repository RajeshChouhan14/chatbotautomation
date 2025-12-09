# U-Ask – AI/ML QA Automation Suite  
### End-to-End Playwright Automation for a Government AI Chatbot (with Local Mock Environment)

This project provides a fully automated QA test suite for **U-Ask**, a generative AI-powered UAE Government chatbot.  
Because the real U-Ask environment is not publicly available, this project includes a **local mock chatbot UI** that mimics the same selectors, behaviors, and interaction patterns, enabling all tests to run successfully.

The test suite validates:

- Chatbot UI behavior (desktop + mobile)
- GPT-powered response quality (hallucination checks, keywords, formatting)
- Multilingual consistency (EN/AR)
- Security handling (XSS, prompt injection, system override)
- Fallback responses
- Accessibility basics

---

# 📁 **1. Project Structure**

u-ask-qa-automation/
├── package.json
├── playwright.config.ts
├── README.md
├── test-data.json
│
├── utils/
│ └── chatbot-helpers.ts
│
├── tests/
│ ├── ui-behavior.spec.ts
│ ├── ai-responses.spec.ts
│ └── security.spec.ts
│
└── u-ask-mock-chatbot/
├── index.html
├── widget.html
├── chatbot.js
├── styles.css

yaml
Copy code

---

# ⚙️ **2. Installation & Setup Instructions**

Follow these steps EXACTLY to run the project successfully.

---

## ✅ **Step 1 — Install Node.js (if not installed)**

Download from:  
https://nodejs.org/en/download/

Verify installation:

```bash
node -v
npm -v
✅ Step 2 — Install Playwright & Project Dependencies
Open terminal in the root of u-ask-qa-automation:

bash
Copy code
cd u-ask-qa-automation
npm install
npx playwright install
This installs:

Playwright browsers (Chromium/WebKit)

Test runner

TypeScript types

All required dependencies

🖥️ 3. Start the Local Mock Chatbot Server
The mock chatbot UI must be served via HTTP for Playwright to load it.

From root folder:

Install http-server (if not installed)
bash
Copy code
npm install -g http-server
OR using npx (no global install):

bash
Copy code
npx http-server . -p 8080
Start the server:
bash
Copy code
npx http-server . -p 8080
You will see:

nginx
Copy code
Available on:
  http://127.0.0.1:8080
  http://192.168.xx.xx:8080
Verify in browser:
arduino
Copy code
http://127.0.0.1:8080/u-ask-mock-chatbot
You should see:

"U-Ask Mock Host"

Chatbot iframe with working UI

🌐 4. Configure BASE_URL for Playwright Tests
Open a NEW terminal window (your server must keep running).

On PowerShell (Windows):
powershell
Copy code
$env:BASE_URL = "http://127.0.0.1:8080/u-ask-mock-chatbot"
On Git Bash / macOS / Linux:
bash
Copy code
export BASE_URL="http://127.0.0.1:8080/u-ask-mock-chatbot"
Verify:

bash
Copy code
echo $BASE_URL
🧪 5. Running the Tests
Run all tests:

bash
Copy code
npm test
Or:

bash
Copy code
npx playwright test
🎯 Run specific test suites:
UI Behavior Tests
bash
Copy code
npx playwright test tests/ui-behavior.spec.ts
AI Response Validation Tests
bash
Copy code
npx playwright test tests/ai-responses.spec.ts
Security Tests
bash
Copy code
npx playwright test tests/security.spec.ts
🌍 6. Running Tests in Only English or Only Arabic
Tests use TEST_LANG environment variable.

English only:
bash
Copy code
$env:TEST_LANG="en" ; npx playwright test      # PowerShell
TEST_LANG=en npx playwright test              # bash
Arabic only:
bash
Copy code
$env:TEST_LANG="ar" ; npx playwright test
TEST_LANG=ar npx playwright test
Default = both languages
📊 7. Generating Reports
Playwright HTML report:

bash
Copy code
npx playwright test --reporter=html
Open report:

bash
Copy code
npx playwright show-report
You will see:

Passed / failed test summary

Timings

Screenshots

Videos

Traces (DOM snapshots, network logs)

This is perfect for including in your submitted Test Report.

🔍 8. Understanding the Mock Chatbot Behavior
The mock chatbot under u-ask-mock-chatbot/ simulates:

✔ Passport renewal response (EN/AR)
✔ Residency visa renewal response (EN/AR)
✔ Hallucination avoidance
✔ Fallback messages
✔ Loading indicator
✔ XSS sanitization
✔ Prompt injection blocking
✔ System override refusal
✔ LTR/RTL bubble direction
✔ Scroll behavior
✔ User bubbles and AI bubbles
All behaviors match what the test suite expects.

📌 9. Troubleshooting
❗ Issue: Tests failing with "iframe not found"
➡️ Ensure the server is running from root folder:

bash
Copy code
npx http-server . -p 8080
Not:

bash
Copy code
npx http-server u-ask-mock-chatbot -p 8080   # ❌ wrong for Option C
❗ Issue: Tests can’t find AI messages
Likely BASE_URL is wrong.

Correct:

bash
Copy code
http://127.0.0.1:8080/u-ask-mock-chatbot
❗ Issue: Port 8080 already in use
Use a different port:

bash
Copy code
npx http-server . -p 9090
$env:BASE_URL="http://127.0.0.1:9090/u-ask-mock-chatbot"
📝 10. How to Run Against a Real U-Ask Deployment (If Provided)
When you receive a real URL:

Stop mock server

Set:

bash
Copy code
$env:BASE_URL="https://real-uask-url-here"
Update selectors inside:

bash
Copy code
utils/chatbot-helpers.ts
Run same tests — no code changes needed.

🎉 11. Final Notes
This project demonstrates:

Robust Playwright automation

AI/ML test design (non-deterministic outputs handled via heuristics)

Security validation

Multilingual testing

iframe-based widget targeting

Use of mock UI to simulate unavailable production systems