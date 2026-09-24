/*
 * Knowledge base for the demo: the public help centre of Shiftbloom, a fictional
 * shift-scheduling product for cafés and restaurants. Every fact here is invented
 * for this portfolio piece, so the demo contains no third-party content.
 *
 * In a real project this file is generated from the client's own material:
 * help centre, PDFs, policy documents, past support replies.
 *
 * Product names of the POS, payroll and chat tools are invented too (Tilltap,
 * Payloom, Pulsechat...), so nothing here states anything about a real company.
 */
(function (root, factory) {
  var kb = factory();
  if (typeof module === 'object' && module.exports) module.exports = kb;
  else root.KNOWLEDGE_BASE = kb;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return {
    company: {
      name: 'Shiftbloom',
      tagline: 'Shift scheduling for cafés and restaurants',
      supportEmail: 'hello@shiftbloom.example',
      updated: '2026-09-18'
    },
    documents: [
      {
        id: 'pricing',
        title: 'Pricing & Billing',
        type: 'Help centre article',
        category: 'Pricing',
        updated: '2026-09-12',
        sections: [
          {
            id: 'plans',
            title: 'Plans and monthly price',
            category: 'Pricing',
            tags: ['pricing', 'plans', 'starter', 'growth', 'multi-site', 'per location'],
            questions: [
              'How much does Shiftbloom cost?',
              'What are your plans and prices?',
              'How much per month for one café?',
              'What does it cost for a small café or bakery?',
              'What is the price for two or three locations?'
            ],
            body: 'Shiftbloom is priced per location, per month. Starter is $29 and covers up to 15 staff at one location. Growth is $59 and covers unlimited staff, shift swaps and sales forecasting at one location. Multi-site is for three locations or more: $49 per location per month for every location, including the first two, and it adds central reporting. Every plan includes the mobile apps and email support at no extra cost.'
          },
          {
            id: 'annual-discount',
            title: 'Annual billing discount',
            category: 'Pricing',
            tags: ['annual', 'yearly', 'discount', 'invoice'],
            questions: [
              'Is there a discount if I pay yearly?',
              'Do you offer annual billing?',
              'Can I pay for a year upfront?'
            ],
            body: 'Yes. Paying annually gives you two months free, so Starter is $290 a year, Growth is $590 a year per location, and Multi-site is $490 a year per location. You can switch from monthly to annual at any time from Billing → Plan, and we credit the unused part of the month you already paid for.'
          },
          {
            id: 'trial',
            title: 'Free trial',
            category: 'Pricing',
            tags: ['trial', 'free', 'card', 'evaluation'],
            questions: [
              'Do you have a free trial?',
              'Can I try Shiftbloom before paying?',
              'Do I need a credit card to start the trial?'
            ],
            body: 'Every account starts with a 21-day free trial of the Growth plan. No card is needed to start, and we do not charge anything automatically: when the trial ends the account switches to read-only until you choose a plan. Your schedules and staff data stay intact for 90 days after that.'
          },
          {
            id: 'payment-methods',
            title: 'Accepted payment methods',
            category: 'Pricing',
            tags: ['payment', 'card', 'sepa', 'paypal', 'invoice', 'vat'],
            questions: [
              'How can I pay?',
              'Which payment methods do you accept?',
              'Can I pay by bank transfer?'
            ],
            body: 'We accept Visa, Mastercard and American Express, SEPA direct debit for EU accounts, and bank transfer for annual plans over $1,000. Every payment produces a PDF invoice with your VAT number, available under Billing → Invoices. We do not accept cash or prepaid vouchers.'
          },
          {
            id: 'cancellation',
            title: 'Cancelling a subscription',
            category: 'Pricing',
            tags: ['cancel', 'unsubscribe', 'downgrade', 'notice period'],
            questions: [
              'How do I cancel my subscription?',
              'Can I cancel any time?',
              'Is there a notice period or contract?'
            ],
            body: 'You can cancel yourself at any time from Billing → Plan → Cancel subscription. There is no contract and no notice period. The account stays fully usable until the end of the period you have already paid for, then becomes read-only. Nothing is deleted automatically: you can export or reactivate within 90 days.'
          },
          {
            id: 'refunds',
            title: 'Refund policy',
            category: 'Pricing',
            tags: ['refund', 'money back', 'annual'],
            questions: [
              'Do you give refunds?',
              'Can I get my money back?',
              'What is your refund policy?'
            ],
            body: 'Monthly plans are not refunded for the current month, but you are never charged again after you cancel. Annual plans are refunded pro rata for the full months remaining if you cancel within the first six months. Write to hello@shiftbloom.example and we process the refund within five working days.'
          }
        ]
      },
      {
        id: 'getting-started',
        title: 'Getting Started',
        type: 'Onboarding guide',
        category: 'Setup',
        updated: '2026-08-30',
        sections: [
          {
            id: 'setup-time',
            title: 'How long setup takes',
            category: 'Setup',
            tags: ['setup', 'onboarding', 'launch', 'first schedule'],
            questions: [
              'How long does it take to set up?',
              'How quickly can we start using it?',
              'Is setup complicated?'
            ],
            body: 'A single café is usually live in about 40 minutes: add your location and opening hours, import staff, then build the first week from a template. Most teams publish their first real schedule the same day. Multi-site accounts take longer because each location needs its own opening hours and roles.'
          },
          {
            id: 'import-staff',
            title: 'Importing staff and past schedules',
            category: 'Setup',
            tags: ['import', 'csv', 'migration', 'excel', 'spreadsheet'],
            questions: [
              'Can I import my staff from a spreadsheet?',
              'How do I migrate from Excel or another app?',
              'Can you import our existing rota?'
            ],
            body: 'Yes. Settings → Staff → Import accepts a CSV or Excel file with name, email, role, contracted hours and pay rate; the importer previews every row before anything is saved. Past schedules can be imported the same way, which is what our forecasting uses to suggest staffing levels in the first weeks.'
          },
          {
            id: 'onboarding-help',
            title: 'Onboarding help from our team',
            category: 'Setup',
            tags: ['onboarding call', 'training', 'help', 'setup service'],
            questions: [
              'Do you help with setup?',
              'Is there an onboarding call?',
              'Do you train my managers?'
            ],
            body: 'Every new account can book a free 30-minute onboarding call, and Multi-site accounts get a second call for manager training. Both are booked from the banner on your dashboard. We also set up your first location for you at no charge if you send your current rota to hello@shiftbloom.example.'
          },
          {
            id: 'languages',
            title: 'Languages supported',
            category: 'Setup',
            tags: ['language', 'translation', 'localisation'],
            questions: [
              'What languages does Shiftbloom support?',
              'Is the app available in Spanish?',
              'Can staff use it in their own language?'
            ],
            body: 'The web app and both mobile apps are available in English, Spanish, French, German, Italian and Portuguese. Each person picks their own language in their profile, so a manager can work in English while the team reads shift notifications in Spanish. Dates and currency follow the location, not the person.'
          }
        ]
      },
      {
        id: 'scheduling',
        title: 'Scheduling & Shifts',
        type: 'Help centre article',
        category: 'Scheduling',
        updated: '2026-09-05',
        sections: [
          {
            id: 'publish',
            title: 'Publishing a schedule',
            category: 'Scheduling',
            tags: ['publish', 'notify', 'notifications', 'draft'],
            questions: [
              'How do staff find out about their shifts?',
              'What happens when I publish the schedule?',
              'Do people get notified about changes?'
            ],
            body: 'A schedule stays a private draft until you press Publish. On publishing, everyone with a shift gets a push notification and an email, and later edits send a separate "shift changed" alert only to the people affected. You can see who has opened the schedule under the Seen column.'
          },
          {
            id: 'swaps',
            title: 'Shift swaps and cover requests',
            category: 'Scheduling',
            tags: ['swap', 'cover', 'trade shifts', 'approval'],
            questions: [
              'Can staff swap shifts?',
              'How do cover requests work?',
              'Do I have to approve a swap?'
            ],
            body: 'Staff on the Growth and Multi-site plans can offer a shift to colleagues who have the right role and no clashing shift. A swap only becomes real when a manager approves it, unless you turn on auto-approve for swaps inside the same role. Every swap is kept in the shift history with both names and the time of approval.'
          },
          {
            id: 'availability',
            title: 'Availability and time-off requests',
            category: 'Scheduling',
            tags: ['availability', 'holiday', 'time off', 'unavailable'],
            questions: [
              'Can staff set when they are available?',
              'How do holiday requests work?',
              'Does it stop me scheduling someone on holiday?'
            ],
            body: 'Staff set weekly availability and request time off from their app. Approved time off and declared unavailability block the calendar: if you drag a shift onto that person anyway, Shiftbloom warns you before saving. Pending requests appear as a striped marker so you can see them while planning.'
          },
          {
            id: 'forecasting',
            title: 'Sales forecasting and labour cost',
            category: 'Scheduling',
            tags: ['forecast', 'labour cost', 'budget', 'sales'],
            questions: [
              'Can it tell me how many people I need?',
              'Does it show labour cost as I plan?',
              'How does the sales forecast work?'
            ],
            body: 'On the Growth and Multi-site plans, Shiftbloom forecasts hourly sales from the last 8 weeks of your POS data and weekday patterns, then suggests how many people each hour needs. The planner shows live labour cost and labour-cost percentage against that forecast, so you see a problem while you are building the week rather than at month end.'
          },
          {
            id: 'templates',
            title: 'Schedule templates and repeating weeks',
            category: 'Scheduling',
            tags: ['template', 'repeat', 'copy week'],
            questions: [
              'Can I reuse last week\'s schedule?',
              'Are there schedule templates?',
              'How do I copy a week?'
            ],
            body: 'Yes. Any week can be saved as a template, and Copy week duplicates a previous week into the one you are planning, keeping roles and times while skipping people who are now unavailable. Many venues keep separate templates for quiet season, high season and holiday weeks.'
          }
        ]
      },
      {
        id: 'time-payroll',
        title: 'Time Clock & Payroll',
        type: 'Help centre article',
        category: 'Time & pay',
        updated: '2026-09-10',
        sections: [
          {
            id: 'clock-in',
            title: 'Clocking in and out',
            category: 'Time & pay',
            tags: ['clock in', 'attendance', 'tablet', 'pin', 'gps'],
            questions: [
              'How do staff clock in?',
              'Is there a time clock?',
              'Can people clock in from their phone?'
            ],
            body: 'Staff clock in with a four-digit PIN on a shared tablet at the venue, or from their own phone when you allow it. Phone clock-ins can require the person to be inside a radius you set around the location, from 50 to 500 metres. Early or late clock-ins outside a 5-minute window are flagged for the manager to confirm.'
          },
          {
            id: 'missed-clock-out',
            title: 'Missed clock-ins and forgotten clock-outs',
            category: 'Time & pay',
            tags: ['forgot to clock out', 'missed clock in', 'auto clock out', 'correction'],
            questions: [
              'What happens if someone forgets to clock out?',
              'Can a manager fix a missed clock-in?',
              'Does it close open shifts automatically?'
            ],
            body: 'If someone never clocks out, Shiftbloom closes the entry at the scheduled end time after 3 hours and marks it "needs review" instead of guessing paid hours. The manager sets the real time from Time → Timesheets, and the person gets a note saying their entry was corrected. Repeat offenders show up in the weekly Time issues digest.'
          },
          {
            id: 'timesheets',
            title: 'Timesheet approval',
            category: 'Time & pay',
            tags: ['timesheet', 'approve', 'hours', 'edit'],
            questions: [
              'How do I approve hours?',
              'Can I edit a timesheet?',
              'Where do I check worked hours?'
            ],
            body: 'Timesheets sit under Time → Timesheets, grouped by pay period. Each line shows scheduled versus actual time and the difference. A manager can edit any line, and every edit keeps the original value with the name of the person who changed it, which is what auditors normally ask for.'
          },
          {
            id: 'payroll-export',
            title: 'Payroll export',
            category: 'Time & pay',
            tags: ['payroll', 'export', 'csv', 'payloom', 'ledgerly'],
            questions: [
              'Can I export hours to payroll?',
              'Does it work with my payroll provider?',
              'How do I get hours into Ledgerly?'
            ],
            body: 'Approved timesheets export as CSV, or go directly to Payloom, Ledgerly or Wagebox through the built-in connection. The export contains regular hours, overtime hours, unpaid breaks and pay rate per person. Shiftbloom itself does not pay wages and does not calculate tax.'
          },
          {
            id: 'overtime',
            title: 'Overtime and break rules',
            category: 'Time & pay',
            tags: ['overtime', 'breaks', 'labour law', 'compliance', 'minors'],
            questions: [
              'Does it handle overtime rules?',
              'Can it enforce breaks?',
              'Will it warn me about labour law?'
            ],
            body: 'You set the rules per location: weekly hours before overtime, overtime multiplier, minimum rest between shifts, and required break length per shift length. The planner warns you while you build the schedule when a rule would be broken, and timesheets mark overtime separately. Rules for staff under 18 can be set to stricter limits.'
          }
        ]
      },
      {
        id: 'integrations',
        title: 'Integrations & Apps',
        type: 'Help centre article',
        category: 'Integrations',
        updated: '2026-09-18',
        sections: [
          {
            id: 'pos-integrations',
            title: 'POS integrations',
            category: 'Integrations',
            tags: ['pos', 'tilltap', 'brewline', 'panfare', 'coinlane', 'sales data'],
            questions: [
              'Which POS systems do you support?',
              'Does it connect to Tilltap?',
              'Can you pull sales data from my till?'
            ],
            body: 'Shiftbloom connects to Tilltap, Brewline Restaurant, Panfare and Coinlane. The connection pulls hourly sales every 15 minutes and feeds the forecast and the labour-cost percentage. You connect it yourself under Settings → Integrations; it takes about two minutes and needs only a manager login to the POS.'
          },
          {
            id: 'other-integrations',
            title: 'Payroll, accounting and calendar connections',
            category: 'Integrations',
            tags: ['payloom', 'ledgerly', 'wagebox', 'calendar', 'ical', 'team chat'],
            questions: [
              'What else does Shiftbloom integrate with?',
              'Can shifts appear in my calendar app?',
              'Can it post to our team chat?'
            ],
            body: 'Besides POS, we connect to Payloom, Ledgerly and Wagebox for payroll, publish a personal iCal shift feed that works in any calendar app, and post schedule-published announcements to Pulsechat in a channel of your choice.'
          },
          {
            id: 'unsupported-integrations',
            title: 'Systems we do not support yet',
            category: 'Integrations',
            tags: ['kettle', 'paywell', 'bookline', 'orbit', 'roadmap', 'not supported'],
            questions: [
              'Do you integrate with Kettle POS?',
              'Is Paywell supported?',
              'What if my system is not on the list?'
            ],
            body: 'Kettle POS, Paywell, Bookline Accounts and Orbit POS are not supported today. For anything that is not on our list you can still use the CSV export, or build your own connection with the REST API. Tell us what you use at hello@shiftbloom.example — requested integrations are prioritised by how many venues ask for them.'
          },
          {
            id: 'api',
            title: 'API access',
            category: 'Integrations',
            tags: ['api', 'rest', 'webhook', 'developer', 'token'],
            questions: [
              'Do you have an API?',
              'Can developers build on Shiftbloom?',
              'Are there webhooks?'
            ],
            body: 'Yes. Growth and Multi-site accounts can create REST API tokens under Settings → Developer, with read and write access to staff, shifts and timesheets, plus webhooks for shift published, swap approved and timesheet approved. The limit is 120 requests per minute and the reference lives at docs.shiftbloom.example.'
          },
          {
            id: 'mobile-apps',
            title: 'Mobile apps and offline use',
            category: 'Integrations',
            tags: ['mobile', 'ios', 'android', 'offline', 'app store'],
            questions: [
              'Is there a mobile app?',
              'Does it work on iPhone and Android?',
              'Can staff see their schedule on their phone?',
              'Can my team check the rota on Android?',
              'What happens if the internet goes down?'
            ],
            body: 'There are free apps for iOS 16+ and Android 10+, included in every plan, for both managers and staff. The apps keep the current and next week readable offline, and clock-ins made without a connection are stored on the device and sync as soon as it is back. The web planner needs a connection.'
          }
        ]
      },
      {
        id: 'company',
        title: 'About Shiftbloom',
        type: 'Company page',
        category: 'Company',
        updated: '2026-09-02',
        sections: [
          {
            id: 'who-we-are',
            title: 'Who we are',
            category: 'Company',
            tags: ['about', 'company', 'team size', 'founded', 'office', 'headquarters'],
            questions: [
              'Who is behind Shiftbloom?',
              'How many employees does Shiftbloom have?',
              'Where is your office?',
              'When was the company founded?'
            ],
            body: 'Shiftbloom was founded in 2021 by two former café managers and is a team of 24 people. The company is registered in Berlin, where the only office is; everyone else works remotely across Europe. We are independently owned, with no outside investors.'
          },
          {
            id: 'customers',
            title: 'Who uses Shiftbloom',
            category: 'Company',
            tags: ['customers', 'venues', 'how many locations', 'case study'],
            questions: [
              'How many venues use Shiftbloom?',
              'How many locations do you have?',
              'What kind of businesses use it?'
            ],
            body: 'About 1,200 venues in 14 countries use Shiftbloom: independent cafés, bakeries, small restaurant groups and two university canteens. The typical account is a single location with 9 to 20 staff. The largest runs 38 locations from one dashboard.'
          }
        ]
      },
      {
        id: 'trust-support',
        title: 'Security, Privacy & Support',
        type: 'Policy page',
        category: 'Trust',
        updated: '2026-09-15',
        sections: [
          {
            id: 'gdpr',
            title: 'GDPR and where data is stored',
            category: 'Trust',
            tags: ['gdpr', 'privacy', 'data location', 'dpa', 'eu'],
            questions: [
              'Are you GDPR compliant?',
              'Where is my data stored?',
              'Can I sign a data processing agreement?'
            ],
            body: 'Shiftbloom is GDPR compliant and stores all customer data in the EU, in Frankfurt, with backups in Dublin. We sign a data processing agreement with any account that asks: request it from Settings → Legal and it is countersigned within two working days. We never sell data and never use your staff data to train anything.'
          },
          {
            id: 'security',
            title: 'Security measures',
            category: 'Trust',
            tags: ['security', 'encryption', 'two-factor', 'backup', 'audit'],
            questions: [
              'How secure is my data?',
              'Do you support two-factor authentication?',
              'How often do you back up?'
            ],
            body: 'Data is encrypted in transit with TLS 1.3 and at rest with AES-256. Two-factor authentication is available on every plan and can be made compulsory for managers. Backups run hourly and are kept for 35 days, and an external penetration test is carried out once a year with the summary available on request.'
          },
          {
            id: 'data-deletion',
            title: 'Deleting your data',
            category: 'Trust',
            tags: ['delete', 'erase', 'right to be forgotten', 'account closure'],
            questions: [
              'How do I delete my data?',
              'What happens to data after I leave?',
              'Can an employee ask to be erased?'
            ],
            body: 'Closing the account from Settings → Account → Delete removes everything within 35 days, backups included — that is the length of one backup cycle. An individual employee can also be erased on request: their personal details are removed while worked hours stay as anonymous entries, because payroll records must be kept for six years.'
          },
          {
            id: 'account-access',
            title: 'Signing in, passwords and locked accounts',
            category: 'Trust',
            tags: ['password', 'reset password', 'login', 'locked out', 'sso'],
            questions: [
              'How do I reset my password?',
              'I am locked out of my account, what do I do?',
              'Can we sign in with Google?'
            ],
            body: 'Use "Forgot password" on the sign-in page and the reset link arrives within a minute, valid for 2 hours. Accounts lock for 15 minutes after 10 failed attempts. Managers can also send a reset link to any team member from Settings → Staff. Google and Microsoft single sign-on are available on the Multi-site plan.'
          },
          {
            id: 'support-hours',
            title: 'Support channels and response time',
            category: 'Trust',
            tags: ['support', 'contact', 'response time', 'chat', 'phone'],
            questions: [
              'How do I contact support?',
              'What are your support hours?',
              'Can I call you?',
              'Do you have a phone number?',
              'How fast do you answer?'
            ],
            body: 'Email hello@shiftbloom.example or use the in-app chat, Monday to Friday 08:00–18:00 CET. First reply is within 4 working hours on Starter and Growth, and within 1 hour on Multi-site, which also includes weekend cover for anything that stops a schedule being published. There is no phone line.'
          },
          {
            id: 'uptime',
            title: 'Uptime and status',
            category: 'Trust',
            tags: ['uptime', 'downtime', 'status page', 'sla', 'incident'],
            questions: [
              'How reliable is the service?',
              'Do you have a status page?',
              'What is your uptime guarantee?'
            ],
            body: 'Uptime over the last 12 months was 99.96%, and Multi-site accounts have a 99.9% contractual guarantee with service credits if we miss it. Live status and incident history are at status.shiftbloom.example, and planned maintenance is announced there at least 48 hours in advance.'
          }
        ]
      }
    ]
  };
});
