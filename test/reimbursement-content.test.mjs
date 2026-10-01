import assert from 'node:assert/strict';
import test from 'node:test';

import { my } from '../src/data/content.mjs';

const copy = my.dashboard.reimbursement;
const thanks = my.dashboard.thanks;

/* The strings a host reads once their Fest has ended: the "Get
   reimbursed" card (direction A on the 2026-09-30 canvas) and the Meet
   Up's thank-you. A prose line with a link or bold run in it is a list of
   pieces, as the Useful info prize lines are: a string is text, { strong }
   bold, { email } the team's inbox as a mailto link. */

const flatten = (pieces) =>
  pieces
    .map((piece) =>
      typeof piece === 'string'
        ? piece
        : piece.strong || piece.email || piece.link,
    )
    .join('');

test('the card and its three steps', () => {
  assert.equal(copy.title, 'Get reimbursed');
  assert.equal(copy.stepCounter(1, 3), 'Step 1 of 3');
  assert.equal(
    copy.intro,
    'Hacktoberfest Hack Days are eligible for reimbursement. Complete the steps below and we’ll get you set up on our reimbursement platform.',
  );
  assert.equal(copy.wrapUp.title, 'Wrap up your Fest');
  assert.equal(copy.claim.title, 'Your reimbursement');
  assert.equal(copy.payee.title, 'Tell us who gets paid');
  assert.deepEqual(copy.status, {
    done: 'Done',
    locked: 'Locked',
    agreed: 'Agreed',
    approved: 'Approved by MLH',
    /* Step 2 for a Hack Day with digital gift cards (gift-cards-content). */
    requested: 'Requested',
  });
});

test('step 1 names the four checks', () => {
  assert.deepEqual(copy.wrapUp.labels, {
    checkIns: 'Attendees checked in',
    submissions: 'Projects submitted',
    winners: 'Winner selected for all challenges with submissions',
    photos: 'Photos uploaded',
  });
  assert.equal(copy.wrapUp.progress(3, 4), '3 of 4 done');
});

test('step 1 says what each failure needs, without the check-in threshold', () => {
  const { fix } = copy.wrapUp;

  assert.equal(fix.checkIns, 'Not enough attendees are checked in yet.');
  assert.equal(fix.checkInsCta, 'Check people in on Organizer HQ');
  assert.ok(!/\d/.test(fix.checkIns), 'the threshold never leaves the API');
  assert.equal(fix.submissions, 'No projects have been submitted yet.');
  assert.equal(
    fix.winners(['Best Use of Gemma 4']),
    'Best Use of Gemma 4 needs a winner.',
  );
  assert.equal(
    fix.winners(['Best Use of Gemma 4', 'Best UI']),
    'Best Use of Gemma 4 and Best UI need a winner.',
  );
  assert.equal(
    fix.winners(['Best Use of Gemma 4', 'Best UI', 'Best Hack']),
    'Best Use of Gemma 4, Best UI and Best Hack need a winner.',
  );
  assert.equal(fix.winnersCta, 'Pick winners in Organizer HQ');
  assert.equal(fix.photos, 'No photos in your album yet.');
  assert.equal(fix.photosCta, 'Upload photos');
});

test('step 1 counts the album and says when it is still checking', () => {
  assert.equal(copy.wrapUp.photosCount(86), '86 photos in your album');
  assert.equal(copy.wrapUp.photosCount(1), '1 photo in your album');
  assert.equal(
    copy.wrapUp.pending,
    'Still checking. This can take up to an hour after your Fest.',
  );
  assert.equal(
    copy.wrapUp.hint,
    'Recently completed one of these steps? Please wait up to an hour for the change to sync to Hacktoberfest.com.',
  );
});

/* MLH cannot read winners for us yet (a 403 on challenge submissions), so
   the winners row can wait for days. It promises no time. */
test('the winners row waits without promising a time', () => {
  const { winnersPending } = copy.wrapUp;

  assert.equal(winnersPending.cta, 'Pick your winners in Organizer HQ');
  assert.equal(
    `${winnersPending.cta}${winnersPending.tail}`,
    'Pick your winners in Organizer HQ.',
  );
  assert.ok(!/hour|minute|day/.test(winnersPending.tail));
});

test('step 1 done, or cleared by MLH', () => {
  assert.equal(
    copy.wrapUp.summary,
    'Check-ins, projects, winners and photos are all in.',
  );
  assert.equal(
    copy.wrapUp.approvedSummary,
    'You have completed all the steps required to be eligible for reimbursement.',
  );
});

test('step 2: the handbook is linked from its own box', () => {
  const { handbook } = copy.claim;

  assert.equal(
    handbook.href,
    'https://hacktoberfest-handbook.mlh.com/reimbursements',
  );
  assert.equal(
    flatten(handbook.statement),
    'I’ve read the reimbursements page in the host handbook.',
  );
  assert.deepEqual(handbook.statement[1], {
    link: 'reimbursements page',
    href: handbook.href,
  });
});

test('step 2: the limit and how it is worked out', () => {
  const { limit } = copy.claim;

  assert.equal(limit.label, 'Your limit');
  assert.equal(limit.currency, 'USD');
  assert.equal(
    flatten(limit.calc(42, '$5.80', 'Canada')),
    '42 check-ins × $5.80 per check-in in Canada',
  );
  assert.deepEqual(limit.calc(42, '$5.80', 'Canada')[0], { strong: '42' });
  assert.equal(
    flatten(limit.calc(1, '$5.80', 'Canada')),
    '1 check-in × $5.80 per check-in in Canada',
  );
  assert.equal(
    limit.body,
    'This is the most MLH can reimburse for your Fest. You’re paid back what you actually spent, up to this amount, against itemized receipts.',
  );
});

test('step 2: over the cap, the hint says why the count stops', () => {
  const { limit } = copy.claim;

  assert.equal(
    limit.cappedHint(50),
    'Reimbursement is capped at up to 50 check-ins per Fest.',
  );
});

test('step 2: spent more, the agreement, and Continue', () => {
  assert.equal(
    flatten(copy.claim.spentMore),
    'Spent more than this? Email hacktoberfest@mlh.io before you send any receipts and we’ll help you work out what to do.',
  );
  assert.equal(
    copy.claim.agreeStatement,
    'I understand the reimbursement policy and agree to follow it.',
  );
  assert.equal(copy.claim.continueCta, 'Continue');
  assert.equal(copy.claim.incomplete, 'Tick both boxes to continue.');
  assert.equal(
    flatten(copy.claim.summary('$243.60', 42)),
    'Up to $243.60 USD for 42 check-ins. You’ve read the handbook and agreed to the policy.',
  );
});

test('step 2: a country with no rate is told to email', () => {
  const { noRate } = copy.claim;

  assert.equal(noRate.lead('Iraq'), 'We don’t have a set rate for Iraq.');
  assert.equal(noRate.lead(null), 'We don’t have a set rate for your country.');
  assert.equal(
    flatten(noRate.body),
    'Email hacktoberfest@mlh.io and we’ll work out your reimbursement with you, and tell you what comes next.',
  );
  assert.equal(noRate.cta, 'Email hacktoberfest@mlh.io');
  assert.equal(
    flatten(noRate.handbook),
    'In the meantime, read the reimbursements page in the host handbook.',
  );
  assert.equal(noRate.handbook[1].href, copy.claim.handbook.href);
  assert.equal(copy.email, 'hacktoberfest@mlh.io');
});

test('step 3: who gets paid', () => {
  const { payee } = copy;

  assert.equal(
    payee.intro,
    'This person gets the invite from Ramp and the payment. It can be you or anyone on your team.',
  );
  assert.deepEqual(payee.fields, {
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
  });
  assert.equal(
    payee.emailHint,
    'Ramp sends the invite here. Use an address they check.',
  );
  assert.equal(payee.onceLead, 'You can only send this once.');
  assert.equal(
    flatten(payee.onceBody),
    'It covers the whole Fest, for every host. To change it afterwards, email hacktoberfest@mlh.io.',
  );
  assert.equal(payee.sendCta, 'Send to MLH');
  assert.equal(payee.sendingCta, 'Sending…');
});

test('step 3: a failed send says what to do next', () => {
  assert.deepEqual(copy.payee.errors, {
    invalid:
      'Check the details: every field needs filling in, and the email needs to be a full address.',
    changed:
      'Something about your Fest changed since this page loaded. Reload the page to see where it stands.',
    unavailable: 'We couldn’t reach MLH to send this. Try again in a moment.',
  });
});

test('sent: the headline and who sent it', () => {
  const { sent } = copy;

  assert.equal(sent.title, 'You’re set up for reimbursement');
  assert.equal(
    sent.meta({ byYou: true, date: 'October 25', amount: '$243.60' }),
    'Sent by you on October 25 · up to $243.60 USD',
  );
  assert.equal(
    sent.meta({ byYou: false, date: 'October 25', amount: '$243.60' }),
    'Sent by a co-host on October 25 · up to $243.60 USD',
  );
  assert.equal(
    sent.meta({ byYou: true, date: null, amount: null }),
    'Sent by you',
  );
});

test('sent: the Ramp invite, and where it goes', () => {
  const { sent } = copy;

  assert.equal(
    flatten(sent.ramp('Jamie Rivera', 'jamie@sharkhacks.ca')),
    'Look out for an invite from Ramp, MLH’s reimbursement platform, within 5 business days. It goes to Jamie Rivera at jamie@sharkhacks.ca.',
  );
  assert.equal(
    flatten(sent.rampNoPayee),
    'Look out for an invite from Ramp, MLH’s reimbursement platform, within 5 business days.',
  );
});

test('sent: what happens next, from MLH’s email', () => {
  const { next } = copy.sent;

  assert.equal(copy.sent.nextLabel, 'What happens next');
  assert.equal(next.accept, 'Accept the Ramp invite and set up the account.');
  assert.equal(
    next.details,
    'Fill in your contact, bank and tax details. Missing details can delay payment.',
  );
  assert.equal(
    next.id,
    'You may need to upload an ID (passport, driver’s license or national ID) to verify yourself.',
  );
  assert.equal(
    next.receipts,
    'Upload full itemized receipts. If Ramp asks for a Class, Category or memo, use these:',
  );
  assert.equal(
    next.paid,
    'Once MLH approves your receipts, the money goes straight to your bank account. That usually takes under a week, depending on your country.',
  );
  assert.equal(
    flatten(next.deadline('November 23', 'December 23')),
    'Submit your receipts by November 23, 30 days after your Fest. Your Ramp account closes on December 23.',
  );
  assert.equal(
    flatten(next.deadlineUndated),
    'Submit your receipts within 30 days of your Fest. Your Ramp account closes 60 days after it.',
  );
});

test('sent: the three values Ramp asks for', () => {
  const { rampFields: ramp } = copy.sent;

  assert.equal(ramp.class.label, 'Class');
  assert.equal(ramp.class.value, 'Club Events');
  assert.equal(ramp.category.label, 'Category');
  assert.equal(
    ramp.category.value,
    '15080 - Facilities, Catering, & Attendee Transportation',
  );
  assert.equal(ramp.memo.label, 'Memo');
  assert.equal(copy.sent.copyCta, 'Copy');
  assert.equal(copy.sent.copiedCta, 'Copied');
  assert.equal(
    flatten(copy.sent.questions),
    'Questions? Email hacktoberfest@mlh.io.',
  );
});

test('a Meet Up is thanked, with its photo links', () => {
  assert.equal(thanks.title, 'Thanks for hosting!');
  assert.equal(
    thanks.body,
    'We hope your Meetup went well! We’d love for you to share photos with us.',
  );
  assert.deepEqual(thanks.upload, {
    label: 'Upload',
    hint: 'Add your photos to MLH’s album for this Fest.',
    cta: 'Upload photos',
  });
  assert.deepEqual(thanks.gallery, {
    label: 'Gallery',
    hint: 'Share the album with your community.',
    cta: 'Open gallery',
  });
});

/* Every string these blocks can render, with the functions called. */
const rendered = () => {
  const strings = [];
  const walk = (value) => {
    if (typeof value === 'string') strings.push(value);
    else if (typeof value === 'function') {
      walk(
        value.length === 1 && value === copy.wrapUp.fix.winners
          ? value(['A', 'B'])
          : value(42, '$5.80', 'Canada'),
      );
    } else if (Array.isArray(value)) value.forEach(walk);
    else if (value && typeof value === 'object')
      Object.values(value).forEach(walk);
  };
  walk(copy);
  walk(thanks);
  walk(copy.sent.meta({ byYou: false, date: 'October 25', amount: '$1' }));
  return strings;
};

test('no new string carries an em dash or a straight apostrophe', () => {
  for (const string of rendered()) {
    assert.ok(!string.includes('—'), `an em dash in: ${string}`);
    assert.ok(!string.includes("'"), `a straight apostrophe in: ${string}`);
  }
});

test('people are hosts, never organizers', () => {
  for (const string of rendered()) {
    assert.ok(
      !/organi[sz]er/i.test(string.replaceAll('Organizer HQ', '')),
      `"organizer" in: ${string}`,
    );
  }
});
