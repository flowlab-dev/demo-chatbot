/* Shiftbloom demo — interface layer.
   All text from the knowledge base is inserted as text, never as HTML. */
(function () {
  'use strict';

  var engine = window.ChatEngine;
  var kb = window.KNOWLEDGE_BASE;
  var evalSet = window.EVAL_QUESTIONS || [];
  var index = engine.buildIndex(kb.documents);

  var sectionsById = {};
  kb.documents.forEach(function (doc) {
    doc.sections.forEach(function (section) {
      sectionsById[doc.id + '#' + section.id] = section;
    });
  });

  function questionFor(id, fallback) {
    var section = sectionsById[id];
    return section && section.questions && section.questions[0] ? section.questions[0] : fallback;
  }

  var thread = document.getElementById('thread');
  var composer = document.getElementById('composer');
  var input = document.getElementById('question');
  var suggestionsBox = document.getElementById('suggestions');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var STARTERS = [
    'How much does it cost?',
    'Do you have a free trial?',
    'Which POS systems do you support?',
    'Are you GDPR compliant?'
  ];

  /* ---------- small DOM helpers ---------- */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function scrollThread() {
    thread.scrollTop = thread.scrollHeight;
  }

  /* ---------- messages ---------- */

  function addUser(text) {
    var msg = el('div', 'msg msg--user');
    msg.appendChild(el('p', null, text));
    thread.appendChild(msg);
    scrollThread();
  }

  function addTyping() {
    var msg = el('div', 'msg msg--bot');
    var bubble = el('div', 'bubble');
    var dots = el('span', 'typing');
    dots.appendChild(el('span'));
    dots.appendChild(el('span'));
    dots.appendChild(el('span'));
    bubble.appendChild(dots);
    bubble.appendChild(el('span', 'visually-hidden', 'Looking through the help centre'));
    msg.setAttribute('role', 'status');
    msg.appendChild(bubble);
    thread.appendChild(msg);
    scrollThread();
    return msg;
  }

  function confidenceMeter(value) {
    var wrap = el('div', 'meter');
    var track = el('span', 'meter__track');
    var fill = el('span', 'meter__fill');
    fill.style.width = Math.round(Math.min(1, value) * 100) + '%';
    track.appendChild(fill);
    wrap.appendChild(el('span', null, 'Match'));
    wrap.appendChild(track);
    wrap.appendChild(el('span', null, Math.round(value * 100) + '%'));
    return wrap;
  }

  function choiceRow(items) {
    var row = el('div', 'choices');
    items.forEach(function (item) {
      var button = el('button', 'choice', item.label);
      button.type = 'button';
      button.addEventListener('click', function () { ask(item.question); });
      row.appendChild(button);
    });
    return row;
  }

  function addAnswer(result) {
    var msg = el('div', 'msg msg--bot');
    var bubble = el('div', 'bubble');
    bubble.appendChild(el('p', null, result.answer));

    var receipt = el('div', 'receipt');
    receipt.appendChild(el('span', null, 'Source:'));
    var strong = el('strong', null, result.source.document + ' › ' + result.source.section);
    receipt.appendChild(strong);
    receipt.appendChild(el('span', null, 'updated ' + result.source.updated));
    bubble.appendChild(receipt);
    bubble.appendChild(confidenceMeter(result.confidence));
    msg.appendChild(bubble);

    if (result.related && result.related.length) {
      msg.appendChild(choiceRow(result.related.slice(0, 2).map(function (item) {
        return { label: item.title, question: questionFor(item.id, item.title) };
      })));
    }

    thread.appendChild(msg);
    scrollThread();
  }

  function addClarify(result) {
    var msg = el('div', 'msg msg--bot');
    var bubble = el('div', 'bubble');
    bubble.appendChild(el('p', null, 'I can see a few sections that could be what you mean, and I would rather not guess. Which one is it?'));
    bubble.appendChild(confidenceMeter(result.confidence));
    msg.appendChild(bubble);
    msg.appendChild(choiceRow(result.suggestions.map(function (item) {
      return { label: item.title, question: questionFor(item.id, item.question) };
    })));
    thread.appendChild(msg);
    scrollThread();
  }

  function addUnknown(result) {
    var msg = el('div', 'msg msg--bot is-unknown');
    var bubble = el('div', 'bubble');
    var line = el('p');
    var unknown = (result.unknownWords || []).filter(function (word) { return word.length > 2; });

    if (unknown.length) {
      line.appendChild(document.createTextNode('There is nothing in the Shiftbloom help centre about '));
      unknown.slice(0, 2).forEach(function (word, i) {
        if (i) line.appendChild(document.createTextNode(' or '));
        line.appendChild(el('span', 'unknown-word', '“' + word + '”'));
      });
      line.appendChild(document.createTextNode(', so I will not guess at it.'));
    } else {
      line.textContent = 'I cannot find that in the Shiftbloom help centre, so I will not guess at it.';
    }
    bubble.appendChild(line);

    var hand = el('p');
    hand.appendChild(document.createTextNode('Write to '));
    var mail = el('a', null, kb.company.supportEmail);
    mail.href = 'mailto:' + kb.company.supportEmail;
    hand.appendChild(mail);
    hand.appendChild(document.createTextNode(' and a person will reply during support hours.'));
    bubble.appendChild(hand);
    msg.appendChild(bubble);

    msg.appendChild(choiceRow([
      { label: 'Pricing and billing', question: 'How much does Shiftbloom cost per month?' },
      { label: 'What it does', question: 'How do staff find out about their shifts?' }
    ]));

    thread.appendChild(msg);
    scrollThread();
  }

  /* ---------- asking ---------- */

  var busy = false;
  var pendingTimer = null;

  function cancelPending() {
    if (pendingTimer !== null) {
      window.clearTimeout(pendingTimer);
      pendingTimer = null;
    }
    busy = false;
  }

  function ask(question) {
    var text = String(question || '').trim();
    if (!text || busy) return;
    busy = true;
    input.value = '';
    addUser(text);

    var typing = addTyping();
    var result;
    try {
      result = engine.ask(text, index);
    } catch (error) {
      typing.remove();
      busy = false;
      var failure = el('div', 'msg msg--bot is-unknown');
      var bubble = el('div', 'bubble');
      bubble.appendChild(el('p', null, 'Something went wrong while searching the help centre. Ask again, or write to ' + kb.company.supportEmail + '.'));
      failure.appendChild(bubble);
      thread.appendChild(failure);
      scrollThread();
      return;
    }

    pendingTimer = window.setTimeout(function () {
      pendingTimer = null;
      typing.remove();
      if (result.status === 'answer') addAnswer(result);
      else if (result.status === 'clarify') addClarify(result);
      else addUnknown(result);
      busy = false;
    }, reduceMotion ? 0 : 420);
  }

  composer.addEventListener('submit', function (event) {
    event.preventDefault();
    ask(input.value);
  });

  /* ---------- greeting and starters ---------- */

  function greet() {
    cancelPending();
    thread.textContent = '';
    var msg = el('div', 'msg msg--bot');
    var bubble = el('div', 'bubble');
    bubble.appendChild(el('p', null, 'Hello. I answer questions about Shiftbloom from our help centre — pricing, scheduling, time clock, integrations, data and support.'));
    bubble.appendChild(el('p', null, 'If something is not written there, I will tell you instead of inventing it.'));
    msg.appendChild(bubble);
    thread.appendChild(msg);
  }

  STARTERS.forEach(function (question) {
    var button = el('button', 'suggestion', question);
    button.type = 'button';
    button.addEventListener('click', function () { ask(question); });
    suggestionsBox.appendChild(button);
  });

  document.getElementById('resetChat').addEventListener('click', function () {
    greet();
    input.focus();
  });

  Array.prototype.forEach.call(document.querySelectorAll('[data-ask]'), function (button) {
    button.addEventListener('click', function () {
      ask(button.getAttribute('data-ask'));
      document.getElementById('assistant').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    });
  });

  /* ---------- knowledge base browser ---------- */

  var kbBox = document.getElementById('kb');
  kb.documents.forEach(function (doc, docIndex) {
    var details = el('details', 'kb__doc');
    if (docIndex === 0) details.open = true;
    var summary = el('summary');
    summary.appendChild(el('span', null, doc.title));
    summary.appendChild(el('span', 'kb__count', doc.sections.length + ' sections · updated ' + doc.updated));
    details.appendChild(summary);

    var list = el('ul', 'kb__list');
    doc.sections.forEach(function (section) {
      var li = el('li');
      var button = el('button', 'kb__ask');
      button.type = 'button';
      button.appendChild(el('span', 'kb__title', section.title));
      button.appendChild(el('span', 'kb__q', section.questions[0]));
      button.addEventListener('click', function () {
        ask(section.questions[0]);
        document.getElementById('assistant').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      });
      li.appendChild(button);
      list.appendChild(li);
    });
    details.appendChild(list);
    kbBox.appendChild(details);
  });

  /* ---------- in-page evaluation ---------- */

  function runEvaluation() {
    var answerable = 0, answerableOk = 0, outOfScope = 0, noFactStated = 0;
    var saidUnknown = 0, askedToClarify = 0;
    var failures = [];

    evalSet.forEach(function (test) {
      var result = engine.ask(test.q, index);
      if (test.expect === 'answer') {
        answerable++;
        if (result.status === 'answer' && result.source.id === test.section) answerableOk++;
        else failures.push({ q: test.q, want: test.section, got: result.status === 'answer' ? result.source.id : result.status });
        return;
      }

      outOfScope++;
      var wanted = test.expect === 'clarify' ? 'a clarifying question'
        : test.expect === 'unknown' ? 'an "I do not know"'
        : 'no stated fact';
      var ok = test.expect === 'refuse' ? result.status !== 'answer' : result.status === test.expect;

      if (ok) {
        noFactStated++;
        if (result.status === 'unknown') saidUnknown++; else askedToClarify++;
      } else {
        failures.push({ q: test.q, want: wanted, got: result.status === 'answer' ? 'answered from ' + result.source.id : result.status });
      }
    });

    var box = document.getElementById('evalResult');
    box.textContent = '';

    var passed = answerableOk + noFactStated;
    var summary = el('div', 'eval__summary');

    function stat(label, value, good) {
      var cell = el('div');
      var number = el('p', 'eval__score ' + (good ? 'eval__ok' : 'eval__bad'), value);
      number.style.margin = '0';
      cell.appendChild(number);
      cell.appendChild(el('span', null, label));
      return cell;
    }

    summary.appendChild(stat('questions answered from the right section', answerableOk + '/' + answerable, answerableOk === answerable));
    summary.appendChild(stat('out-of-scope questions where no fact was stated — ' + saidUnknown + ' said “I don’t know”, ' + askedToClarify + ' asked which topic was meant',
      noFactStated + '/' + outOfScope, noFactStated === outOfScope));
    summary.appendChild(stat('total passed', passed + '/' + evalSet.length, passed === evalSet.length));
    box.appendChild(summary);

    if (failures.length) {
      var table = el('table');
      var head = el('tr');
      head.appendChild(el('th', null, 'Question'));
      head.appendChild(el('th', null, 'Expected'));
      head.appendChild(el('th', null, 'Got'));
      table.appendChild(head);
      failures.forEach(function (failure) {
        var row = el('tr');
        row.appendChild(el('td', null, failure.q));
        row.appendChild(el('td', null, failure.want));
        row.appendChild(el('td', null, failure.got));
        table.appendChild(row);
      });
      box.appendChild(table);
    } else {
      box.appendChild(el('p', null, 'Every question behaved as the set requires: no invented answers, no missed answers. The same set runs from the command line with node demo/tests/run-eval.js.'));
    }
  }

  document.getElementById('runEval').addEventListener('click', runEvaluation);

  /* ---------- theme ---------- */

  var root = document.documentElement;
  var toggle = document.getElementById('themeToggle');
  var themeLabel = document.getElementById('themeLabel');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var next = theme === 'dark' ? 'light' : 'dark';
    themeLabel.textContent = next === 'dark' ? 'Dark' : 'Light';
    toggle.setAttribute('aria-label', 'Switch to ' + next + ' theme');
  }

  var stored = null;
  try { stored = window.localStorage.getItem('shiftbloom-theme'); } catch (error) { stored = null; }
  applyTheme(stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

  toggle.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { window.localStorage.setItem('shiftbloom-theme', next); } catch (error) { /* private mode: theme just resets */ }
  });

  greet();
})();
