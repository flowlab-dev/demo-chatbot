# Shiftbloom support assistant — demo

> **Self-initiated demo by [Flow Lab](https://flowlab-dev.github.io) - not client work.** The company in it is invented.
> Live demo: https://flowlab-dev.github.io/demo/chatbot/ · Case study: https://flowlab-dev.github.io/work/support-assistant/ · License: MIT


A support assistant that answers only from a company's own help centre, prints the
source under every answer, and says plainly when the answer is not in the material.

Shiftbloom is an invented company (shift scheduling for cafés and restaurants). All
content in `data/knowledge-base.js` was written for this demonstration.

## Open it

Double-click `index.html`. No server, no build step, no API keys, no internet.

The two display faces come from Google Fonts. With no connection the page falls back
to system faces and everything — including the test runner — still works; only the
lettering changes.

## Run the question set

In the browser: the button **Run the test set** on the page.

From a terminal:

```
node tests/run-eval.js        # summary, exits 1 if a case fails
node tests/run-eval.js -v     # every question and what it matched
```

The set contains 74 questions: 62 the help centre covers — written the way customers
actually type them, including paraphrases and real typos — and 12 it must not answer.
A case passes only if the assistant answers from the expected section, or states no
fact where stating one would be invention. All 74 pass: of the 12 out-of-scope
questions it says "I don't know" to 9 and asks which topic was meant for 3.

## Files

| File | What it is |
|---|---|
| `index.html` | the demo page |
| `assets/engine.js` | retrieval and grounding: BM25 ranking, synonym concepts, coverage, thresholds |
| `assets/app.js` | interface: chat, knowledge-base browser, in-page test runner, theme |
| `assets/styles.css` | visual system, light and dark |
| `data/knowledge-base.js` | the knowledge base: 7 documents, 33 sections |
| `tests/eval-questions.js` | the question set |
| `tests/run-eval.js` | command-line runner |

## How an answer is decided

1. The question is tokenised, stemmed, and each word is expanded into a concept
   with its synonyms. A concept contributes once, at its best variant, so a section
   stuffed with one word cannot win on repetition alone.
2. Sections are ranked by BM25 over weighted fields (title, example questions, tags,
   body), with a bonus when the whole phrasing is close to one of the section's own
   example questions.
3. Coverage measures how much of the question the section accounts for, weighted by
   how rare each word is. Words the knowledge base has never seen weigh heavily.
4. A word the base has never seen is matched to the closest word it knows, within
   one edit (two for long words), counting a swap of neighbouring letters as one:
   "cancle", "mcuh", "pyroll", "complient" all land correctly. Words that are real
   English but simply absent ("sick", "loyalty") are never rewritten.
5. Thresholds decide the outcome:
   - confidence ≥ 0.52, coverage ≥ 0.62, and at least one matched word specific
     enough to pin down a section → answer, with its source;
   - confidence ≥ 0.3 with plausible sections → ask which topic is meant;
   - otherwise → say it does not know, name the unrecognised word, offer a human.

There is no generative step, so the assistant cannot produce a sentence that is not
in the knowledge base.

## In a real project

The knowledge base is generated from the client's own material (help centre, PDFs,
policies, past support replies) and the assistant is embedded in their site. A
language model can be placed on top of this retrieval step, on the client's own key,
to rephrase the retrieved section — the grounding, the source line and the test set
stay exactly as they are here.
