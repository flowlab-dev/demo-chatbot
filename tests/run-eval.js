#!/usr/bin/env node
/*
 * Runs the evaluation set against the real retrieval engine - the same file the
 * browser widget loads. Exits with code 1 if any case fails, so it can be wired
 * into a client's CI.
 *
 *   node demo/tests/run-eval.js          summary
 *   node demo/tests/run-eval.js -v       every question
 */
'use strict';

var path = require('path');
var engine = require(path.join(__dirname, '..', 'assets', 'engine.js'));
var kb = require(path.join(__dirname, '..', 'data', 'knowledge-base.js'));
var cases = require(path.join(__dirname, 'eval-questions.js'));

var index = engine.buildIndex(kb.documents);
var verbose = process.argv.indexOf('-v') !== -1;

var results = { pass: 0, fail: 0, failures: [] };
var answered = 0;
var noFactStated = 0;
var saidUnknown = 0;
var askedToClarify = 0;

cases.forEach(function (test) {
  var result = engine.ask(test.q, index);
  var ok;
  var got;

  if (test.expect === 'answer') {
    got = result.status === 'answer' ? result.source.id : result.status;
    ok = result.status === 'answer' && result.source.id === test.section;
    if (ok) answered++;
  } else if (test.expect === 'clarify' || test.expect === 'unknown') {
    got = result.status === 'answer' ? 'answered: ' + result.source.id : result.status;
    ok = result.status === test.expect;
    if (ok) {
      noFactStated++;
      if (result.status === 'unknown') saidUnknown++; else askedToClarify++;
    }
  } else {
    got = result.status === 'answer' ? 'answered: ' + result.source.id : result.status;
    ok = result.status !== 'answer';
    if (ok) {
      noFactStated++;
      if (result.status === 'unknown') saidUnknown++; else askedToClarify++;
    }
  }

  if (ok) {
    results.pass++;
    if (verbose) console.log('  PASS  ' + test.q + '  ->  ' + got + '  (' + result.confidence + ')');
  } else {
    results.fail++;
    var wanted = test.expect === 'answer' ? test.section
      : test.expect === 'clarify' ? 'a clarifying question'
      : test.expect === 'unknown' ? 'an "I do not know"'
      : 'no stated fact';
    results.failures.push({ q: test.q, expected: wanted, got: got, confidence: result.confidence });
    console.log('  FAIL  ' + test.q);
    console.log('        expected ' + wanted + ', got ' + got + ' (confidence ' + result.confidence + ')');
  }
});

var grounded = cases.filter(function (c) { return c.expect === 'answer'; }).length;
var outOfScope = cases.length - grounded;

console.log('');
console.log('Shiftbloom assistant - evaluation');
console.log('  answerable questions  : ' + answered + '/' + grounded + ' answered from the right section');
console.log('  out-of-scope questions: ' + noFactStated + '/' + outOfScope + ' stated no fact - ' +
  saidUnknown + ' said "I do not know", ' + askedToClarify + ' asked which topic was meant');
console.log('  total                 : ' + results.pass + '/' + cases.length + ' passed');

if (results.fail) {
  console.log('');
  console.log(results.fail + ' case(s) failed.');
  process.exit(1);
}
console.log('  all cases passed.');
