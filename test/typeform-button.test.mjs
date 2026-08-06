import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import TypeformButton from '../src/components/TypeformButton.mjs';

test('renders an SDK popup trigger as a button without an outbound link', () => {
  const markup = renderToStaticMarkup(
    createElement(
      TypeformButton,
      {
        className: 'test-cta',
        form: {
          id: 'form-id',
          tracking: { utm_content: 'test-cta' },
          hidden: { organizer_interest: 'true' },
        },
      },
      'Open form',
    ),
  );

  assert.match(markup, /<button/);
  assert.match(markup, /class="test-cta"/);
  assert.match(markup, /type="button"/);
  assert.doesNotMatch(markup, /\shref=/);
  assert.match(markup, />Open form<\/button>$/);
});
