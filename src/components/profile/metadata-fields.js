import { useCallback, useEffect, useMemo, useState } from 'react';
import countryList from 'country-list';

import CheckRadio from './check-radio';

const countries = [{
  code: '',
  name: 'Prefer not to say',
}].concat(
  Object.entries(countryList.getCodeList())
    .map(([ code, name ]) => ({ code, name }))
    .sort((a, b) => a.name.localeCompare(b.name)),
);

const MetadataFields = ({ emails, metadata, exclude, value, onChange, disabled = false }) => {
  const [ fields, setFields ] = useState({});

  // Group the metadata by category
  useEffect(() => {
    // Group the metadata by category for the UI
    const groupedMetadata = metadata.reduce((obj, item) => ({
      ...obj,
      [item.name.split('-')[0]]: [
        ...(obj[item.name.split('-')[0]] || []),
        {
          position: Number(item.message?.match(/^(\d+): /)?.[1]) || 0,
          item: {
            ...item,
            message: item.message?.replace(/^(\d+): /, ''),
          },
        },
      ],
    }), {});

    // Drop any categories we don't want to show
    if (exclude) {
      for (const category of exclude) {
        delete groupedMetadata[category];
      }
    }

    // Sort the categories by position
    for (const key in groupedMetadata) {
      groupedMetadata[key].sort((a, b) => a.position - b.position);
      groupedMetadata[key] = groupedMetadata[key].map(item => item.item);
    }

    setFields(groupedMetadata);
  }, [ metadata, exclude ]);

  // Check if emails are to be shown
  const showEmail = useMemo(() => !!emails.length && !exclude?.includes('email'), [ emails, exclude ]);

  // Ensure we can update values easily
  const updateEmail = useCallback(email => {
    onChange({ ...value, email });
  }, [ onChange, value ]);
  const updateMetadata = useCallback(obj => {
    onChange({ ...value, metadata: { ...value.metadata, ...obj } });
  }, [ onChange, value ]);

  // Allow a user to opt-out of all marketing with a single click
  const marketingOptOut = useCallback((e) => {
    e.preventDefault();
    if (disabled) return;
    if (!e.target.checked) return;

    // Determine what we need to change
    const changes = fields.marketing.reduce((obj, item) => ({
      ...obj,
      ...(value.metadata[item.name] ? { [item.name]: false } : {}),
    }), {});

    // If no changes, don't update, so we don't infinite loop
    if (!Object.keys(changes).length) return;

    // Update the values
    updateMetadata(changes);
  }, [ fields, updateMetadata, value ]);

  // Check the opt-out checkbox automatically based on opt-in states
  const marketingOptedOut = useMemo(() => fields.marketing?.every(key => !value.metadata[key.name]), [ fields, value ]);

  return (
    <>
      {(showEmail || !!fields.role || !!fields.stage || !!fields.type) && (
        <fieldset>
          <label>Self-identification</label>

          {showEmail && (
            <fieldset>
              <label htmlFor="email">Email</label>
              <select
                name="email"
                id="email"
                value={value.email}
                onChange={e => updateEmail(e.target.value)}
                disabled={disabled}
                required
              >
                {emails.map(email => (
                  <option key={email} value={email}>{email}</option>
                ))}
              </select>
            </fieldset>
          )}

          {!!fields.role && (
            <fieldset>
              <label>How will you be participating? (select all that apply)</label>
              {fields.role.map(meta => (
                <CheckRadio
                  key={meta.name}
                  title={meta.title}
                  message={meta.message}
                  name={meta.name}
                  onChange={e => updateMetadata({ [meta.name]: e.target.checked })}
                  checked={value.metadata[meta.name]}
                  disabled={disabled}
                />
              ))}
            </fieldset>
          )}

          {!!fields.stage && (
            <fieldset>
              <label htmlFor="stage">What is your experience level?</label>
              {fields.stage.map(meta => (
                <CheckRadio
                  key={meta.name}
                  title={meta.title}
                  message={meta.message}
                  radio
                  name="stage"
                  id="stage"
                  value={meta.name}
                  onChange={e => updateMetadata(fields.stage.reduce((obj, item) => ({
                    ...obj,
                    [item.name]: meta.name === item.name && e.target.checked,
                  }), {}))}
                  checked={value.metadata[meta.name]}
                  disabled={disabled}
                />
              ))}
            </fieldset>
          )}

          {!!fields.type && (
            <fieldset>
              <label>How would you like to contribute? (select all that apply)</label>
              {fields.type.map(meta => (
                <CheckRadio
                  key={meta.name}
                  title={meta.title}
                  message={meta.message}
                  name={meta.name}
                  onChange={e => updateMetadata({ [meta.name]: e.target.checked })}
                  checked={value.metadata[meta.name]}
                  disabled={disabled}
                />
              ))}
            </fieldset>
          )}

          {!!fields.country && (
            <fieldset>
              <label htmlFor="country">What country are you participating from?</label>
              <select
                name="country"
                id="country"
                value={value.metadata.country || ''}
                onChange={e => updateMetadata({ country: e.target.value })}
                disabled={disabled}
              >
                {countries.map(country => (
                  <option key={country.code} value={country.code}>{country.name}</option>
                ))}
              </select>
            </fieldset>
          )}
        </fieldset>
      )}

      {!!fields.operational && (
        <fieldset>
          <label>Operational opt-ins</label>

          {fields.operational.map(meta => (
            <CheckRadio
              key={meta.name}
              title={meta.title}
              message={meta.message}
              name={meta.name}
              onChange={e => updateMetadata({ [meta.name]: e.target.checked })}
              checked={value.metadata[meta.name]}
              disabled={disabled}
            />
          ))}
        </fieldset>
      )}

      {!!fields.marketing && (
        <fieldset>
          <label>Marketing opt-ins</label>

          {fields.marketing.map(meta => (
            <CheckRadio
              key={meta.name}
              title={meta.title}
              message={meta.message}
              name={meta.name}
              onChange={e => updateMetadata({ [meta.name]: e.target.checked })}
              checked={value.metadata[meta.name]}
              disabled={disabled}
            />
          ))}

          <CheckRadio
            title="I do not wish to receive any marketing updates from Hacktoberfest’s partners."
            name="marketing-disabled"
            onChange={marketingOptOut}
            checked={marketingOptedOut}
            disabled={disabled}
          />
        </fieldset>
      )}

      {!!fields.agree && (
        <fieldset>
          <label>Rules &amp; terms</label>

          {fields.agree.map(meta => (
            <CheckRadio
              key={meta.name}
              title={meta.title}
              message={meta.message}
              name={meta.name}
              onChange={e => updateMetadata({ [meta.name]: e.target.checked })}
              checked={value.metadata[meta.name]}
              disabled={disabled}
              required
            />
          ))}
        </fieldset>
      )}
    </>
  )
};

export default MetadataFields;
