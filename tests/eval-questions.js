/*
 * Evaluation set for the Shiftbloom assistant.
 *
 * "answer"  - the assistant must answer, and from the expected section.
 * "refuse"  - the assistant must NOT state a fact: it either says it does not
 *             know, or asks which topic was meant. Anything else is a made-up answer.
 * "clarify" - stricter: the assistant must ask which topic was meant. Used for the
 *             examples shown on the demo page, which have to behave as advertised.
 *
 * Questions are written the way a café owner would actually type them, including
 * paraphrases and typos, not the way the knowledge base is worded.
 */
(function (root, factory) {
  var set = factory();
  if (typeof module === 'object' && module.exports) module.exports = set;
  else root.EVAL_QUESTIONS = set;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  return [
    // --- straightforward questions -------------------------------------------
    { q: 'How much does Shiftbloom cost per month?', expect: 'answer', section: 'pricing#plans' },
    { q: 'What do your plans include?', expect: 'answer', section: 'pricing#plans' },
    { q: 'Is it cheaper if I pay for a whole year?', expect: 'answer', section: 'pricing#annual-discount' },
    { q: 'Do you have a free trial?', expect: 'answer', section: 'pricing#trial' },
    { q: 'Do I need to enter a credit card to try it?', expect: 'answer', section: 'pricing#trial' },
    { q: 'Which payment methods do you accept?', expect: 'answer', section: 'pricing#payment-methods' },
    { q: 'How do I cancel my subscription?', expect: 'answer', section: 'pricing#cancellation' },
    { q: 'What is your refund policy?', expect: 'answer', section: 'pricing#refunds' },
    { q: 'How long does setup take?', expect: 'answer', section: 'getting-started#setup-time' },
    { q: 'Can I import my staff from a spreadsheet?', expect: 'answer', section: 'getting-started#import-staff' },
    { q: 'Do you help us with onboarding?', expect: 'answer', section: 'getting-started#onboarding-help' },
    { q: 'Which languages are supported?', expect: 'answer', section: 'getting-started#languages' },
    { q: 'How do staff find out about their shifts?', expect: 'answer', section: 'scheduling#publish' },
    { q: 'Can staff swap shifts with each other?', expect: 'answer', section: 'scheduling#swaps' },
    { q: 'How do holiday requests work?', expect: 'answer', section: 'scheduling#availability' },
    { q: 'Does it show labour cost while I plan?', expect: 'answer', section: 'scheduling#forecasting' },
    { q: "Can I copy last week's schedule?", expect: 'answer', section: 'scheduling#templates' },
    { q: 'How do staff clock in?', expect: 'answer', section: 'time-payroll#clock-in' },
    { q: 'Where do I approve worked hours?', expect: 'answer', section: 'time-payroll#timesheets' },
    { q: 'Can I export hours to payroll?', expect: 'answer', section: 'time-payroll#payroll-export' },
    { q: 'Does it warn me about overtime rules?', expect: 'answer', section: 'time-payroll#overtime' },
    { q: 'Which POS systems do you support?', expect: 'answer', section: 'integrations#pos-integrations' },
    { q: 'Do you have an API?', expect: 'answer', section: 'integrations#api' },
    { q: 'Is there a mobile app for iPhone?', expect: 'answer', section: 'integrations#mobile-apps' },
    { q: 'Are you GDPR compliant?', expect: 'answer', section: 'trust-support#gdpr' },
    { q: 'Do you support two-factor authentication?', expect: 'answer', section: 'trust-support#security' },
    { q: 'How do I delete all our data?', expect: 'answer', section: 'trust-support#data-deletion' },
    { q: 'What are your support hours?', expect: 'answer', section: 'trust-support#support-hours' },
    { q: 'What is your uptime guarantee?', expect: 'answer', section: 'trust-support#uptime' },

    // --- paraphrases, sloppy typing, no product vocabulary --------------------
    { q: 'price for 2 cafes', expect: 'answer', section: 'pricing#plans' },
    { q: 'i want to stop paying, how', expect: 'answer', section: 'pricing#cancellation' },
    { q: 'can my team trade shifts between them', expect: 'answer', section: 'scheduling#swaps' },
    { q: 'does it connect to Tilltap till', expect: 'answer', section: 'integrations#pos-integrations' },
    { q: 'where do you keep our data, is it in europe', expect: 'answer', section: 'trust-support#gdpr' },
    { q: 'what if the wifi drops during service', expect: 'answer', section: 'integrations#mobile-apps' },
    { q: 'do you integrate with Kettle POS', expect: 'answer', section: 'integrations#unsupported-integrations' },

    // --- the four starter questions offered on the demo page ------------------
    { q: 'How much does it cost?', expect: 'answer', section: 'pricing#plans' },
    { q: 'labour cost while planning', expect: 'answer', section: 'scheduling#forecasting' },

    // --- wording taken from real support inboxes ------------------------------
    { q: 'can i get an invoice with vat', expect: 'answer', section: 'pricing#payment-methods' },
    { q: 'do you take amex', expect: 'answer', section: 'pricing#payment-methods' },
    { q: 'how many days is the trial', expect: 'answer', section: 'pricing#trial' },
    { q: 'is there a way to see who has read the schedule', expect: 'answer', section: 'scheduling#publish' },
    { q: 'what happens to hours if someone forgets to clock out', expect: 'answer', section: 'time-payroll#missed-clock-out' },
    { q: 'how do i reset my password', expect: 'answer', section: 'trust-support#account-access' },
    { q: 'is my data used for ai training', expect: 'answer', section: 'trust-support#gdpr' },
    { q: 'send shifts to our team chat', expect: 'answer', section: 'integrations#other-integrations' },
    { q: 'can i block someone from being scheduled when theyre off sick', expect: 'answer', section: 'scheduling#availability' },
    { q: 'how fast do you reply to emails', expect: 'answer', section: 'trust-support#support-hours' },

    // --- cases the reviewer found answered wrongly ---------------------------
    { q: 'can I call you', expect: 'answer', section: 'trust-support#support-hours' },
    { q: 'do you have a phone number', expect: 'answer', section: 'trust-support#support-hours' },
    { q: 'how many locations do you have', expect: 'answer', section: 'company#customers' },
    { q: 'how many employees does Shiftbloom have', expect: 'answer', section: 'company#who-we-are' },
    { q: 'where are your servers located', expect: 'answer', section: 'trust-support#gdpr' },
    { q: 'can staff see the schedule on their phone', expect: 'answer', section: 'integrations#mobile-apps' },
    { q: 'can staff see the rota on android', expect: 'answer', section: 'integrations#mobile-apps' },
    { q: 'whats the price for a small bakery with 8 staff', expect: 'answer', section: 'pricing#plans' },

    // --- typed badly, the way people actually type ---------------------------
    { q: 'cancle my account', expect: 'answer', section: 'pricing#cancellation' },
    { q: 'how mcuh does it cost', expect: 'answer', section: 'pricing#plans' },
    { q: 'gdpr complient?', expect: 'answer', section: 'trust-support#gdpr' },
    { q: 'pyroll export', expect: 'answer', section: 'time-payroll#payroll-export' },
    { q: 'integartion with tiltap', expect: 'answer', section: 'integrations#pos-integrations' },

    // --- must refuse: nothing in the knowledge base covers this ---------------
    { q: 'Can Shiftbloom file my restaurant tax return?', expect: 'refuse' },
    { q: 'Do you sell coffee beans wholesale?', expect: 'refuse' },
    { q: 'What is the weather in Lisbon tomorrow?', expect: 'refuse' },
    { q: 'Do you offer franchise financing or business loans?', expect: 'refuse' },
    { q: 'Can you write my employment contracts for me?', expect: 'refuse' },
    { q: 'Who is the CEO of Shiftbloom?', expect: 'refuse' },
    { q: 'Do you have an office in Tokyo?', expect: 'refuse' },
    { q: 'can i get a demo of the product with a salesperson', expect: 'refuse' },
    { q: 'what commission do you take on card payments', expect: 'clarify' },
    { q: 'help', expect: 'refuse' },
    { q: 'can you recommend a good coffee supplier', expect: 'refuse' },

    // --- examples printed on the demo page: they must behave as promised -----
    { q: 'do you have a loyalty program for customers', expect: 'unknown' },
    { q: 'How much does Shiftbloom cost per month?', expect: 'answer', section: 'pricing#plans' }
  ];
});
