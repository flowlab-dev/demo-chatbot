/*
 * Shiftbloom Support Assistant - retrieval engine
 * ------------------------------------------------
 * Grounded answering: the assistant may only reply with text that exists in the
 * knowledge base. If retrieval confidence is too low it says "I don't know" and
 * hands the conversation to a human. There is no generative step, so a fabricated
 * answer is structurally impossible.
 *
 * Runs unchanged in the browser (<script src>) and in Node (require) so the
 * automated evaluation tests the exact code the widget uses.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ChatEngine = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var STOP_WORDS = {
    a: 1, about: 1, all: 1, an: 1, and: 1, any: 1, are: 1, as: 1, at: 1, be: 1, been: 1,
    but: 1, by: 1, can: 1, could: 1, did: 1, do: 1, does: 1, doing: 1, for: 1,
    from: 1, get: 1, got: 1, had: 1, has: 1, have: 1, he: 1, her: 1, hey: 1, hi: 1,
    him: 1, his: 1, how: 1, i: 1, if: 1, in: 1, into: 1, is: 1, it: 1, its: 1,
    just: 1, like: 1, may: 1, me: 1, might: 1, must: 1, my: 1, no: 1,
    take: 1, takes: 1, taking: 1, taken: 1, need: 1, needs: 1, needed: 1,
    make: 1, makes: 1, made: 1, way: 1, ways: 1, thing: 1, things: 1,
    able: 1, going: 1, really: 1, also: 1, lets: 1, let: 1, give: 1, gives: 1,
    each: 1, other: 1, others: 1, another: 1, every: 1, everything: 1,
    help: 1, many: 1, please: 1, hello: 1, hi: 1, thanks: 1,
    use: 1, used: 1, uses: 1, using: 1, work: 1, works: 1,
    // contractions typed without an apostrophe
    im: 1, ive: 1, id: 1, youre: 1, youve: 1, theyre: 1, theyve: 1, weve: 1,
    dont: 1, doesnt: 1, didnt: 1, isnt: 1, arent: 1, wasnt: 1, cant: 1,
    wont: 1, wouldnt: 1, couldnt: 1, shouldnt: 1, thats: 1, whats: 1,
    hes: 1, shes: 1, theres: 1, heres: 1, lemme: 1, gonna: 1,
    someone: 1, something: 1, anyone: 1, anything: 1, everyone: 1,
    not: 1, of: 1, on: 1, or: 1, our: 1, please: 1, she: 1, should: 1, so: 1,
    some: 1, such: 1, tell: 1, than: 1, that: 1, the: 1, their: 1, them: 1,
    then: 1, there: 1, these: 1, they: 1, this: 1, those: 1, to: 1, us: 1,
    want: 1, was: 1, we: 1, well: 1, were: 1, what: 1, when: 1, where: 1, whole: 1, during: 1,
    which: 1, who: 1, why: 1, will: 1, with: 1, would: 1, you: 1, your: 1, yours: 1
  };

  /* Words that a customer might use instead of the wording in the knowledge base.
     Each group is interchangeable; query terms are expanded to the whole group
     at a reduced weight so paraphrases still find the right document. */
  var SYNONYM_GROUPS = [
    ['price', 'pricing', 'cost', 'costs', 'fee', 'fees', 'charge', 'charges', 'rate', 'rates', 'expensive', 'cheap', 'cheaper', 'cheapest', 'discount', 'discounts', 'save', 'savings', 'plan', 'plans', 'tier', 'tiers', 'package'],
    ['cancel', 'cancellation', 'cancelling', 'unsubscribe', 'terminate', 'quit', 'leave', 'downgrade', 'stop'],
    ['refund', 'refunds', 'reimburse', 'money-back', 'chargeback'],
    ['trial', 'free', 'demo', 'evaluation', 'try'],
    ['integration', 'integrations', 'integrate', 'connect', 'connects', 'connection', 'sync', 'syncs', 'syncing'],
    ['pos', 'till', 'register', 'checkout'],
    ['mobile', 'app', 'apps', 'phone', 'ios', 'iphone', 'android', 'smartphone'],
    ['export', 'exports', 'download', 'downloads', 'csv', 'spreadsheet', 'excel'],
    ['support', 'contact', 'assistance', 'reach', 'email'],
    ['call', 'calling', 'phone', 'telephone', 'ring', 'hotline'],
    ['onboarding', 'setup', 'set-up', 'migrate', 'migration', 'import', 'importing', 'start', 'started', 'launch'],
    ['gdpr', 'privacy', 'data-protection', 'personal-data', 'compliance', 'compliant'],
    ['security', 'secure', 'encryption', 'encrypted', 'breach', 'protection'],
    ['payroll', 'wages', 'salary', 'payslip'],
    ['timesheet', 'timesheets', 'hours', 'hour', 'worked'],
    ['approve', 'approval', 'approved', 'confirm', 'sign-off', 'authorise', 'authorize'],
    ['schedule', 'scheduling', 'schedules', 'rota', 'roster', 'shift', 'shifts', 'timetable'],
    ['swap', 'swaps', 'swapping', 'trade', 'cover', 'exchange'],
    ['notification', 'notifications', 'alert', 'alerts', 'reminder', 'reminders', 'push', 'sms', 'text'],
    ['staff', 'employee', 'employees', 'team', 'worker', 'workers', 'crew', 'people', 'headcount'],
    ['location', 'locations', 'venue', 'venues', 'site', 'sites', 'branch', 'branches', 'cafe', 'cafes', 'restaurant', 'restaurants'],
    ['store', 'stored', 'storage', 'keep', 'kept', 'host', 'hosted', 'hosting', 'held', 'reside', 'server', 'servers', 'datacentre', 'datacenter', 'located'],
    ['eu', 'europe', 'european', 'frankfurt', 'dublin', 'germany', 'ireland'],
    ['overtime', 'labour', 'labor', 'law', 'laws', 'legal', 'rules', 'regulation', 'regulations'],
    ['invoice', 'invoices', 'billing', 'bill', 'receipt', 'receipts', 'vat', 'tax'],
    ['card', 'visa', 'mastercard', 'amex', 'americanexpress', 'paypal', 'payment', 'payments', 'sepa', 'direct-debit', 'pay', 'paying', 'paid'],
    ['seen', 'read', 'opened', 'viewed', 'acknowledged'],
    ['sick', 'ill', 'illness', 'unwell', 'absence', 'absent', 'holiday', 'vacation', 'unavailable', 'unavailability', 'off'],
    ['minor', 'minors', 'teenager', 'young', 'underage'],
    ['train', 'training', 'ai', 'model', 'algorithm'],
    ['password', 'reset', 'forgot', 'forgotten', 'signin', 'login', 'locked'],
    ['language', 'languages', 'translate', 'translation', 'localisation', 'localization'],
    ['forecast', 'forecasting', 'predict', 'prediction', 'demand', 'budget', 'budgeting'],
    ['account', 'login', 'log-in', 'signin', 'sign-in', 'password', 'access'],
    ['delete', 'deletion', 'remove', 'erase', 'wipe'],
    ['annual', 'yearly', 'year', 'monthly', 'month'],
    ['offline', 'internet', 'wifi', 'connection', 'outage', 'down', 'drop', 'drops', 'disconnect', 'network'],
    ['clock', 'clocking', 'punch', 'attendance', 'check-in']
  ];

  var STEM_EXCEPTIONS = {
    pricing: 'price', prices: 'price', billing: 'bill', invoicing: 'invoice',
    data: 'data', business: 'business', analysis: 'analysis', staff: 'staff',
    payroll: 'payroll', sms: 'sms', ios: 'ios', pos: 'pos', gdpr: 'gdpr',
    hours: 'hour', minutes: 'minute', people: 'person', does: 'do',
    paid: 'pay', paying: 'pay', paying_: 'pay', cancelled: 'cancel', canceled: 'cancel'
  };

  function stem(word) {
    if (STEM_EXCEPTIONS[word]) return STEM_EXCEPTIONS[word];
    var w = word;
    if (w.length <= 3) return w;
    if (/ies$/.test(w) && w.length > 4) return w.slice(0, -3) + 'y';
    if (/(sses|shes|ches|xes)$/.test(w)) return w.slice(0, -2);
    if (/[^s]s$/.test(w) && !/(us|is|ss)$/.test(w)) w = w.slice(0, -1);
    /* Suffix stripping never produces a stump: "used" must not become "us". */
    var stripped = w;
    if (/ing$/.test(w) && w.length > 5) {
      stripped = w.slice(0, -3);
      if (/([bdfglmnprt])\1$/.test(stripped)) stripped = stripped.slice(0, -1);
    } else if (/ed$/.test(w) && w.length > 4) {
      stripped = w.slice(0, -2);
      if (/([bdfglmnprt])\1$/.test(stripped)) stripped = stripped.slice(0, -1);
    } else if (/ly$/.test(w) && w.length > 4) {
      stripped = w.slice(0, -2);
    }
    if (stripped.length >= 3) w = stripped;
    if (/e$/.test(w) && w.length > 4) w = w.slice(0, -1);
    return w;
  }

  /* Built after stem() exists: every synonym is stored under its stem so that
     "cancelling" and "cancellation" land in the same group. */
  var SYNONYM_INDEX = (function () {
    var index = {};
    SYNONYM_GROUPS.forEach(function (group, groupId) {
      group.forEach(function (word) {
        var key = stem(word);
        if (!index[key]) index[key] = [];
        if (index[key].indexOf(groupId) === -1) index[key].push(groupId);
      });
    });
    return index;
  })();

  /* Keeps the customer's own spelling next to each stem so the assistant can say
     exactly which word it did not recognise. */
  function tokenizeWithOriginals(text) {
    var pairs = [];
    if (!text) return pairs;
    String(text)
      .toLowerCase()
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[^a-z0-9\s'-]/g, ' ')
      .split(/[\s'-]+/)
      .forEach(function (word) {
        if (!word || word.length < 2 || STOP_WORDS[word]) return;
        pairs.push({ term: stem(word), word: word });
      });
    return pairs;
  }

  function tokenize(text) {
    if (!text) return [];
    return String(text)
      .toLowerCase()
      .replace(/[‘’]/g, "'")
      .replace(/[^a-z0-9\s'-]/g, ' ')
      .split(/[\s'-]+/)
      .filter(function (word) { return word && word.length > 1 && !STOP_WORDS[word]; })
      .map(stem);
  }

  function synonymGroupsOf(term) {
    return SYNONYM_INDEX[term] || [];
  }

  /* ---------- index building ---------- */

  var FIELD_WEIGHTS = { title: 2.2, questions: 1.8, tags: 1.5, body: 1 };

  function buildIndex(documents) {
    var chunks = [];
    documents.forEach(function (doc) {
      (doc.sections || []).forEach(function (section) {
        chunks.push({
          id: doc.id + '#' + section.id,
          docId: doc.id,
          docTitle: doc.title,
          docType: doc.type,
          updated: doc.updated,
          title: section.title,
          body: section.body,
          questions: section.questions || [],
          tags: section.tags || [],
          category: section.category || doc.category
        });
      });
    });

    var docFreq = {};
    var totalLength = 0;

    chunks.forEach(function (chunk) {
      var weighted = {};
      var plain = {};
      var length = 0;

      function feed(text, weight) {
        tokenize(text).forEach(function (term) {
          weighted[term] = (weighted[term] || 0) + weight;
          plain[term] = true;
          length += weight;
        });
      }

      feed(chunk.title, FIELD_WEIGHTS.title);
      chunk.questions.forEach(function (q) { feed(q, FIELD_WEIGHTS.questions); });
      chunk.tags.forEach(function (t) { feed(t, FIELD_WEIGHTS.tags); });
      feed(chunk.body, FIELD_WEIGHTS.body);

      chunk.terms = weighted;
      chunk.length = length;
      chunk.groups = {};
      Object.keys(plain).forEach(function (term) {
        synonymGroupsOf(term).forEach(function (groupId) { chunk.groups[groupId] = true; });
      });
      chunk.bigrams = bigramsOf(chunk);
      chunk.questionSets = chunk.questions.map(function (q) {
        var set = {};
        tokenize(q).forEach(function (term) { set[term] = true; });
        return set;
      });

      totalLength += length;
      Object.keys(plain).forEach(function (term) {
        docFreq[term] = (docFreq[term] || 0) + 1;
      });
    });

    return {
      chunks: chunks,
      docFreq: docFreq,
      vocabulary: Object.keys(docFreq),
      avgLength: chunks.length ? totalLength / chunks.length : 1,
      count: chunks.length
    };
  }

  function bigramsOf(chunk) {
    var set = {};
    var sources = [chunk.title].concat(chunk.questions, [chunk.body]);
    sources.forEach(function (text) {
      var terms = tokenize(text);
      for (var i = 0; i < terms.length - 1; i++) set[terms[i] + ' ' + terms[i + 1]] = true;
    });
    return set;
  }

  /* ---------- typo tolerance ---------- */

  /* Damerau-Levenshtein: counts a swap of two neighbouring letters as one edit,
     because "mcuh" and "teh" are swaps, not two separate mistakes. */
  function editDistance(a, b, limit) {
    if (Math.abs(a.length - b.length) > limit) return limit + 1;
    var rows = [];
    var i, j;
    for (i = 0; i <= a.length; i++) {
      rows[i] = [];
      rows[i][0] = i;
    }
    for (j = 0; j <= b.length; j++) rows[0][j] = j;

    for (i = 1; i <= a.length; i++) {
      var rowBest = rows[i][0];
      for (j = 1; j <= b.length; j++) {
        var cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
        var value = Math.min(rows[i][j - 1] + 1, rows[i - 1][j] + 1, rows[i - 1][j - 1] + cost);
        if (i > 1 && j > 1 && a.charAt(i - 1) === b.charAt(j - 2) && a.charAt(i - 2) === b.charAt(j - 1)) {
          value = Math.min(value, rows[i - 2][j - 2] + 1);
        }
        rows[i][j] = value;
        if (value < rowBest) rowBest = value;
      }
      if (rowBest > limit) return limit + 1;
    }
    return rows[a.length][b.length];
  }

  /* "cancle", "mcuh", "teh" - customers type these constantly. A word the base has
     never seen is matched to the closest word it does know, within one edit for
     short words and two for long ones. Nothing is corrected silently: the caller
     receives the substitution and can show it. */
  function isTransposition(a, b) {
    if (a.length !== b.length) return false;
    var diff = [];
    for (var i = 0; i < a.length; i++) {
      if (a.charAt(i) !== b.charAt(i)) diff.push(i);
      if (diff.length > 2) return false;
    }
    return diff.length === 2 && diff[1] === diff[0] + 1 &&
      a.charAt(diff[0]) === b.charAt(diff[1]) && a.charAt(diff[1]) === b.charAt(diff[0]);
  }

  function correctTerm(term, index) {
    if (index.docFreq[term]) return null;
    if (term.length < 4) return null;
    /* A word we already understand through a synonym group is a real word, not a
       typo: "sick" must never be "corrected" into "pick". */
    if (synonymGroupsOf(term).length) return null;
    var limit = term.length >= 8 ? 2 : 1;
    var best = null;
    var bestDistance = limit + 1;
    var bestFrequency = -1;
    for (var i = 0; i < index.vocabulary.length; i++) {
      var candidate = index.vocabulary[i];
      if (Math.abs(candidate.length - term.length) > limit) continue;
      if (candidate.length < 4 || candidate.length < term.length - 1) continue;
      var distance = editDistance(term, candidate, limit);
      if (distance > limit) continue;
      var swapped = isTransposition(term, candidate);
      var frequency = (index.docFreq[candidate] || 0) + (swapped ? 1000 : 0);
      /* Same distance, two candidates ("trail" is one edit from both "trial" and
         "train"): prefer a swap of neighbouring letters, then the word the
         knowledge base uses more often. */
      if (distance < bestDistance || (distance === bestDistance && frequency > bestFrequency)) {
        bestDistance = distance;
        bestFrequency = frequency;
        best = candidate;
      }
    }
    return best;
  }

  /* ---------- querying ---------- */

  var K1 = 1.0;   // saturates repeated words quickly: a section that repeats one word does not win on that alone
  var B = 0.72;
  var SYNONYM_WEIGHT = 0.55;    // weight of a synonym when ranking
  var SYNONYM_COVERAGE = 0.85;  // weight of a synonym when measuring coverage

  /* One "concept" per word the customer typed, carrying that word plus its
     synonyms. Scoring takes the best variant inside a concept instead of adding
     them up - otherwise a chunk that happens to contain six words of the same
     synonym group ("payment", "card", "visa"...) beats the chunk that actually
     answers the question. */
  function expandQuery(queryTerms) {
    return queryTerms.map(function (term) {
      var variants = {};
      variants[term] = 1;
      synonymGroupsOf(term).forEach(function (groupId) {
        SYNONYM_GROUPS[groupId].forEach(function (word) {
          var alt = stem(word);
          if (alt !== term) variants[alt] = Math.max(variants[alt] || 0, SYNONYM_WEIGHT);
        });
      });
      return { term: term, variants: variants };
    });
  }

  function scoreChunk(chunk, concepts, index, queryBigrams, questionTerms) {
    var score = 0;
    concepts.forEach(function (concept) {
      var best = 0;
      Object.keys(concept.variants).forEach(function (term) {
        var tf = chunk.terms[term];
        if (!tf) return;
        var df = index.docFreq[term] || 0;
        var idf = Math.log(1 + (index.count - df + 0.5) / (df + 0.5));
        var norm = tf * (K1 + 1) / (tf + K1 * (1 - B + B * chunk.length / index.avgLength));
        var value = concept.variants[term] * idf * norm;
        if (value > best) best = value;
      });
      score += best;
    });
    var phraseHits = 0;
    queryBigrams.forEach(function (bigram) { if (chunk.bigrams[bigram]) phraseHits++; });
    if (phraseHits) score *= 1 + Math.min(0.35, phraseHits * 0.12);

    /* A short question like "how much does it cost?" has one content word, and
       plain keyword weight sends it to whichever section repeats that word most
       ("labour cost"). Comparing the whole phrasing against the example questions
       of each section fixes that: near-identical wording wins. */
    if (questionTerms.length) score *= 1 + 1.3 * questionOverlap(chunk, questionTerms);
    return score;
  }

  /* How close the customer's phrasing is to one of the section's own example
     questions, compared both ways (Jaccard), so a one-word question does not
     count as a perfect match for every long question containing that word. */
  function questionOverlap(chunk, questionTerms) {
    var best = 0;
    chunk.questionSets.forEach(function (set) {
      var setSize = 0;
      var hit = 0;
      Object.keys(set).forEach(function () { setSize++; });
      questionTerms.forEach(function (term) { if (set[term]) hit++; });
      var union = setSize + questionTerms.length - hit;
      var overlap = union > 0 ? hit / union : 0;
      if (overlap > best) best = overlap;
    });
    return best;
  }

  /* How much of what the customer asked is actually covered by this chunk.
     Coverage is the main guard against confident nonsense: a chunk that matches
     one incidental word out of five cannot pass the threshold. */
  function termWeight(term, index) {
    var df = index.docFreq[term] || 0;
    if (df === 0) {
      /* A word the knowledge base has never seen ("amex", "bakery") is exactly
         the word that decides whether we really know the answer, so it weighs
         heavily - but not so much that one unknown noun blocks every reply. */
      return 0.85 * Math.log(1 + (index.count + 0.5) / 0.5);
    }
    return Math.log(1 + (index.count - df + 0.5) / (df + 0.5));
  }

  /* Coverage = how much of the *meaning* of the question this chunk accounts for,
     weighted by how rare each word is. Common words that appear in nearly every
     chunk (the product name, "shift") count for almost nothing, so
     "does Shiftbloom do tax returns?" cannot look half answered. */
  function coverageOf(chunk, queryTerms, index) {
    /* Short words the base has never seen ("wat", "teh") are noise, not meaning. */
    var meaningful = queryTerms.filter(function (term) {
      return (index.docFreq[term] || 0) > 0 || term.length >= 4;
    });
    if (!meaningful.length) meaningful = queryTerms;
    if (!meaningful.length) return 0;
    var total = 0;
    var matched = 0;
    meaningful.forEach(function (term) {
      var weight = termWeight(term, index);
      total += weight;
      if (chunk.terms[term]) { matched += weight; return; }
      var groups = synonymGroupsOf(term);
      for (var i = 0; i < groups.length; i++) {
        if (chunk.groups[groups[i]]) { matched += SYNONYM_COVERAGE * weight; return; }
      }
    });
    return total > 0 ? Math.min(1, matched / total) : 0;
  }

  var THRESHOLDS = {
    answer: 0.52,      // below this the assistant never states a fact
    clarify: 0.3,      // between clarify and answer it offers the closest topics
    coverageFloor: 0.62, // most of the meaning of the question must be covered
    specificity: 1.5     // at least one matched word must be rare enough to pin down a section
  };

  function ask(query, index, options) {
    var opts = options || {};
    var thresholds = opts.thresholds || THRESHOLDS;
    var queryTerms = tokenize(query);
    var uniqueTerms = queryTerms.filter(function (t, i) { return queryTerms.indexOf(t) === i; });

    if (!uniqueTerms.length) {
      return {
        status: 'unknown',
        confidence: 0,
        query: query,
        reason: 'no-content-words',
        matches: []
      };
    }

    var corrections = [];
    uniqueTerms = uniqueTerms.map(function (term) {
      var fixed = correctTerm(term, index);
      if (!fixed) return term;
      corrections.push({ from: term, to: fixed });
      return fixed;
    });

    var expanded = expandQuery(uniqueTerms);
    var queryBigrams = [];
    for (var i = 0; i < queryTerms.length - 1; i++) queryBigrams.push(queryTerms[i] + ' ' + queryTerms[i + 1]);

    /* Ranking multiplies keyword strength by how much of the question a chunk
       covers. Without this, a chunk crammed with one matching word ("payment")
       outranks the chunk that actually answers the whole question. */
    var scored = index.chunks.map(function (chunk) {
      var keyword = scoreChunk(chunk, expanded, index, queryBigrams, uniqueTerms);
      var coverage = coverageOf(chunk, uniqueTerms, index);
      return { chunk: chunk, keyword: keyword, raw: keyword * (0.45 + 0.55 * coverage), coverage: coverage };
    }).sort(function (a, b) { return b.raw - a.raw; });

    var best = scored[0];
    var runnerUp = scored[1];
    if (!best || best.raw <= 0) {
      return { status: 'unknown', confidence: 0, query: query, reason: 'no-match', matches: [] };
    }

    /* Confidence blends three independent signals so one lucky keyword is not enough:
       how much of the question is covered, how strong the match is in absolute terms,
       and how clearly the best chunk beats the second best. */
    var strength = Math.min(1, best.raw / (2.6 * Math.max(2, uniqueTerms.length)));
    var margin = runnerUp && runnerUp.raw > 0
      ? Math.min(1, (best.raw - runnerUp.raw) / best.raw + 0.45)
      : 1;
    var confidence = 0.55 * best.coverage + 0.3 * strength + 0.15 * margin;
    confidence = Math.round(confidence * 100) / 100;

    var matches = scored.slice(0, 3).filter(function (item) { return item.raw > 0; }).map(function (item) {
      return {
        id: item.chunk.id,
        title: item.chunk.title,
        docTitle: item.chunk.docTitle,
        category: item.chunk.category,
        coverage: Math.round(item.coverage * 100) / 100,
        score: Math.round(item.raw * 100) / 100,
        keywordScore: Math.round(item.keyword * 100) / 100
      };
    });

    /* Words the knowledge base has never seen are reported so the interface can
       say which word was not understood; they also weigh heavily inside coverage,
       which is what actually decides whether we may state a fact. */
    var originals = tokenizeWithOriginals(query);
    var corrected = {};
    corrections.forEach(function (fix) { corrected[fix.from] = true; });
    var unknownWords = [];
    originals.forEach(function (pair) {
      if ((index.docFreq[pair.term] || 0) > 0 || corrected[pair.term]) return;
      var groups = synonymGroupsOf(pair.term);
      var covered = groups.some(function (groupId) { return best.chunk.groups[groupId]; });
      if (!covered && unknownWords.indexOf(pair.word) === -1) unknownWords.push(pair.word);
    });

    /* A question built only from words that appear all over the knowledge base
       ("how many locations do you have") matches something everywhere and nothing
       in particular. Before stating a fact we require at least one reasonably
       specific word of the question to be present in the chosen section. */
    var specificity = 0;
    uniqueTerms.forEach(function (term) {
      var present = !!best.chunk.terms[term];
      if (!present) {
        present = synonymGroupsOf(term).some(function (groupId) { return best.chunk.groups[groupId]; });
      }
      if (!present) return;
      var weight = termWeight(term, index);
      if (weight > specificity) specificity = weight;
    });

    /* Wording that nearly repeats one of the section's own example questions is
       specific by itself, even when every single word is common. */
    var phrasingMatch = questionOverlap(best.chunk, uniqueTerms);
    var specificEnough = specificity >= thresholds.specificity || phrasingMatch >= 0.6;

    if (confidence >= thresholds.answer && best.coverage >= thresholds.coverageFloor && specificEnough) {
      return {
        status: 'answer',
        confidence: confidence,
        query: query,
        unknownWords: unknownWords,
        corrections: corrections,
        answer: best.chunk.body,
        source: {
          id: best.chunk.id,
          section: best.chunk.title,
          document: best.chunk.docTitle,
          type: best.chunk.docType,
          updated: best.chunk.updated
        },
        related: matches.slice(1),
        matches: matches
      };
    }

    var plausible = scored.slice(0, 3).filter(function (item) {
      return item.raw > 0 && item.coverage >= 0.35;
    });

    if (confidence >= thresholds.clarify && plausible.length) {
      return {
        status: 'clarify',
        confidence: confidence,
        query: query,
        unknownWords: unknownWords,
        corrections: corrections,
        suggestions: plausible
          .map(function (item) {
            return {
              id: item.chunk.id,
              title: item.chunk.title,
              question: (item.chunk.questions && item.chunk.questions[0]) || item.chunk.title,
              document: item.chunk.docTitle
            };
          }),
        matches: matches
      };
    }

    return {
      status: 'unknown',
      confidence: confidence,
      query: query,
      reason: 'below-threshold',
      unknownWords: unknownWords,
      corrections: corrections,
      matches: matches
    };
  }

  return {
    buildIndex: buildIndex,
    ask: ask,
    tokenize: tokenize,
    stem: stem,
    THRESHOLDS: THRESHOLDS
  };
});
