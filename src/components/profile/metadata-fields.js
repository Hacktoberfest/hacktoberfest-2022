import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import countryList from 'country-list';

import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';

import CheckRadio from './check-radio';
import EmailWarning from './email-warning';
import Input from 'components/Input';
import Select from 'components/Select';
import styled from 'styled-components';
import Divider from 'components/Divider';
import { body24, headline48 } from 'themes/typography';

// Override ISO 3166-1 for some countries
const countryOverrides = {
  tw: 'Taiwan',
}

const countries = [{
  code: '',
  name: 'Prefer not to say',
}].concat(
  Object.entries(countryList.getCodeList())
    .map(([ code, name ]) => ({ code, name: countryOverrides[code] || name }))
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

  const StyledFormSection = styled.div`
    display: flex;
    gap: 48px;
    flex-direction: column;
    padding: 80px 0;
  `;

  const StyledFormSectionTitle = styled.h2`
    ${headline48};
  `;

  const StyledFormGroup = styled.fieldset`
    margin: 0;
    border: 0;
    padding: 0;

    legend {
      padding: 0;
      margin: 0 0 48px;
      display: block;
      width: 100%;
      ${body24};
    }
  `;

  const StyledFormRow = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;

    ${mQ(bp.tablet)} {
      grid-template-columns: repeat(${({$columns}) => $columns}, minmax(0, 1fr));
      gap: 64px;
      align-items: flex-start;
    }
  `;

  return (
    <>
      <StyledFormSection>
        <StyledFormSectionTitle>Self-identification</StyledFormSectionTitle>

        <StyledFormRow $columns={2}>
          <Input
            name="name"
            label="Name"
            value={value.name}
            onChange={e => onChange({ ...value, name: e.target.value })}
            disabled={disabled}
            required
          />

          {showEmail && (
            <Select
              name="email"
              label="Email"
              value={value.email}
              onChange={e => onChange({ ...value, email: e.target.value })}
              disabled={disabled}
              required
              items={emails.map(email => [email, email])}
            />
          )}
        </StyledFormRow>

        {showEmail && (
          <EmailWarning email={value.email} hasHolopin={value.metadata['operational-holopin']} />
        )}

        <Divider />

        {!!fields.role && (
          <>
            <StyledFormGroup>
              <legend>How will you be participating? (select all that apply)</legend>
              <StyledFormRow $columns={3}>
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
              </StyledFormRow>
            </StyledFormGroup>
            <Divider />
          </>
        )}

        {!!fields.stage && (
          <>
            <StyledFormGroup>
              <legend>What is your experience level?</legend>
              <StyledFormRow $columns={3}>
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
              </StyledFormRow>
            </StyledFormGroup>
            <Divider />
          </>
        )}

        {!!fields.type && (
          <>
            <StyledFormGroup>
              <legend>How would you like to contribute? (select all that apply)</legend>
              <StyledFormRow $columns={2}>
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
              </StyledFormRow>
            </StyledFormGroup>
            <Divider />
          </>
        )}

        {!!fields.country && (
          <StyledFormGroup>
            <legend>What country are you participating from?</legend>

            <Select
              name="country"
              label="Country name"
              value={value.metadata.country || ''}
              onChange={e => updateMetadata({ country: e.target.value })}
              disabled={disabled}
              items={countries.map(country => [country.code, country.name])}
            />
          </StyledFormGroup>
        )}
      </StyledFormSection>


      {!!fields.operational && (
        <>
          <Divider type="doubledashed" />
          <StyledFormSection>
            <StyledFormSectionTitle>Operational opt-ins</StyledFormSectionTitle>
            {fields.operational.map(meta => (
              <Fragment key={meta.name}>
                <CheckRadio
                  title={meta.title}
                  message={meta.message}
                  name={meta.name}
                  onChange={e => updateMetadata({ [meta.name]: e.target.checked })}
                  checked={value.metadata[meta.name]}
                  disabled={disabled}
                />
                {!!(meta.name === 'operational-holopin' && value.metadata[meta.name]) && (
                  <EmailWarning email={value.email} hasHolopin />
                )}
              </Fragment>
            ))}
          </StyledFormSection>
        </>
      )}


      {!!fields.marketing && (
        <>
          <Divider type="doubledashed" />
          <StyledFormSection>
            <StyledFormSectionTitle>Marketing opt-ins</StyledFormSectionTitle>
            <StyledFormGroup>
              <legend>Do you wish to accept marketing opt-ins? (select all that apply) [optional]</legend>
              <StyledFormRow $columns={2}>
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
                  title="Don't Email Me"
                  message="I do not wish to receive any marketing updates from Hacktoberfest’s partners."
                  name="marketing-disabled"
                  onChange={marketingOptOut}
                  checked={marketingOptedOut}
                  disabled={disabled}
                />
              </StyledFormRow>
            </StyledFormGroup>
          </StyledFormSection>
        </>
      )}

      {!!fields.agree && (
        <>
          <Divider type="doubledashed" />
          <StyledFormSection>
            <StyledFormSectionTitle>Rules &amp; terms</StyledFormSectionTitle>
            <StyledFormGroup>
              <legend>You must accept terms and conditions to participate. [required]</legend>

              <StyledFormRow $columns={2}>
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
              </StyledFormRow>
            </StyledFormGroup>
          </StyledFormSection>
        </>
      )}
      <Divider type="doubledashed" />
    </>
  )
};

export default MetadataFields;
