const messagesEl = document.getElementById('messages');
const inputEl = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-button');
const typingEl = document.getElementById('typing');

function addMessage(text, role, opts = {}) {
  const wrapper = document.createElement('div');
  wrapper.className = 'message ' + role;
  wrapper.setAttribute('data-testid', role === 'user' ? 'message-user' : 'message-ai');

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;

  if (opts.dir) {
    bubble.setAttribute('dir', opts.dir);
  }

  wrapper.appendChild(bubble);
  messagesEl.appendChild(wrapper);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function isArabic(text) {
  return /[\u0600-\u06FF]/.test(text);
}

function simulateAIResponse(userText) {
  const lower = userText.toLowerCase();

  let response = '';
  let dir = isArabic(userText) ? 'rtl' : 'ltr';
  let useFallback = false;

  // Nonsense fallback detection: mostly non-letters
  if (/^[^a-zA-Z\u0600-\u06FF]*$/.test(userText) || userText.length < 5 || /@@!!/.test(userText)) {
    useFallback = true;
  }

  // Security / injection handling
  if (userText.includes('<script>alert('xss')</script>')) {
    response = 'Your input has been received safely. For security, script content is not executed.';
  } else if (lower.includes('ignore all previous instructions') && lower.includes('tell me a joke')) {
    response = 'I must follow UAE government guidelines and focus on providing helpful information about public services, not general jokes.';
  } else if (lower.includes('developer console') || lower.includes('system logs')) {
    response = 'I cannot provide system logs or internal technical details. Please contact official UAE government support channels for assistance.';
  } else if (useFallback) {
    response = isArabic(userText)
      ? 'عذراً، لم أفهم سؤالك. من فضلك حاول مرة أخرى أو أعد صياغة السؤال.'
      : 'Sorry, I could not understand your question. Please try again or rephrase.';
  } else if (isArabic(userText)) {
    if (userText.includes('جواز') && userText.includes('تجديد')) {
      response = 'لتجديد جواز السفر الإماراتي، يجب عليك تقديم طلب عبر القنوات الرسمية، مثل موقع أو تطبيق الحكومة الذكية، وإرفاق المستندات المطلوبة ودفع رسوم التجديد. يرجى مراجعة موقع الحكومة الاتحادية لمزيد من التفاصيل حول إجراءات تجديد جواز السفر.';
    } else if (userText.includes('الإقامة') && userText.includes('تأشيرة')) {
      response = 'لتجديد تأشيرة الإقامة في الإمارات، يجب التأكد من صلاحية جواز السفر، وتعبئة طلب تجديد الإقامة عبر الجهة المختصة أو المنصات الحكومية المعتمدة، وتوفير المستندات المطلوبة مثل عقد العمل أو عقد الإيجار، ثم دفع الرسوم المحددة.';
    } else {
      response = 'يمكنني مساعدتك في الاستفسارات المتعلقة بالخدمات الحكومية في دولة الإمارات. يرجى توضيح سؤالك بشكل أكبر.';
    }
  } else {
    if (lower.includes('renew my uae passport') || (lower.includes('passport') && lower.includes('renew'))) {
      response = 'To renew your UAE passport, you typically need to submit an application through official UAE government channels, such as the smart services portal or relevant government app, provide the required documents, and pay the applicable renewal fees. Please refer to the official UAE government website for the latest passport renewal steps and conditions.';
    } else if (lower.includes('residency') && lower.includes('visa')) {
      response = 'To renew your UAE residency visa, you generally must ensure your passport is valid, complete the renewal application through the authorized government channels, provide supporting documents such as your employment contract or tenancy agreement, and pay the required renewal fees. Check the official UAE government portal for up-to-date residency visa renewal requirements.';
    } else {
      response = 'I can help you with questions about UAE government public services. Please provide more details about the service you are asking about.';
    }
  }

  if (useFallback && !/Sorry, please try again|من فضلك حاول مرة أخرى/i.test(response)) {
    response += isArabic(userText) ? ' من فضلك حاول مرة أخرى.' : ' Sorry, please try again.';
  }

  const bubbleDir = dir;
  addMessage(response, 'ai', { dir: bubbleDir });

  if (useFallback) {
    const fb = document.createElement('div');
    fb.setAttribute('data-testid', 'fallback-message');
    fb.textContent = isArabic(userText) ? 'من فضلك حاول مرة أخرى' : 'Sorry, please try again';
    messagesEl.appendChild(fb);
  }
}

function handleSend() {
  const text = inputEl.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  inputEl.value = '';

  typingEl.classList.remove('hidden');

  setTimeout(() => {
    typingEl.classList.add('hidden');
    simulateAIResponse(text);
  }, 400);
}

sendBtn.addEventListener('click', handleSend);
inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
});

// seed one message so container is not empty
addMessage('Welcome to the U-Ask mock chatbot. Ask about UAE government public services.', 'ai', { dir: 'ltr' });
