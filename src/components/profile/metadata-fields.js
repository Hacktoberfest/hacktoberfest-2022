import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import countryList from 'country-list';
import styled from 'styled-components';

import { breakpoints as bp, determineMediaQuery as mQ } from 'themes/breakpoints';
import { body24, body18, headline48 } from 'themes/typography';

import { employmentRoles } from 'lib/profile';

import Input from 'components/Input';
import Select from 'components/Select';
import Divider from 'components/Divider';

import CheckRadio from './check-radio';
import EmailWarning from './email-warning';

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

    small,
    span {
      color: ${({ theme }) => theme.colors.neutral.manga300};
      ${body18};
    }

    span {
      display: block;
    }
  }
`;

const StyledFormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;

  ${mQ(bp.tablet)} {
    grid-template-columns: repeat(${({ $columns }) => $columns}, minmax(0, 1fr));
    gap: 64px;
    align-items: flex-start;
  }
`;

const dropdownEmployment = [[
  '',
  'Prefer not to say',
]].concat(employmentRoles.map(role => [role, role]));

const countryOverrides = {
  tw: 'Taiwan',
};

const dropdownCountries = [{
  code: '',
  name: 'Prefer not to say',
}].concat(
  Object.entries(countryList.getCodeList())
    .map(([ code, name ]) => ({ code, name: countryOverrides[code] || name }))
    .sort((a, b) => a.name.localeCompare(b.name)),
).map(country => [country.code, country.name]);

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

  return (
    <>
      <StyledFormSection>
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

        {showEmail && <EmailWarning email={value.email} />}

        {!!fields.role && (
          <>
            <Divider />
            <StyledFormGroup>
              <legend>
                How will you be participating?
                {" "}
                <small>[optional]</small>
                <span>Select all that apply</span>
              </legend>

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
          </>
        )}

        {!!fields.stage && (
          <>
            <Divider />
            <StyledFormGroup>
              <legend>
                What is your experience level?
                {" "}
                <small>[optional]</small>
              </legend>

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
          </>
        )}

        {!!fields.type && (
          <>
            <Divider />
            <StyledFormGroup>
              <legend>
                How would you like to contribute?
                {" "}
                <small>[optional]</small>
                <span>Select all that apply</span>
              </legend>

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
          </>
        )}

        {!!fields.demographic && fields.demographic.map(meta => (
          <Fragment key={meta.name}>
            <Divider />
            <StyledFormGroup>
              <legend>
                {meta.title}
                {!meta.required && (
                  <>
                    {" "}
                    <small>[optional]</small>
                  </>
                )}
              </legend>

              {meta.datatype === 'boolean' && (
                <StyledFormRow $columns={2}>
                  <CheckRadio
                    title="Yes"
                    name={meta.name}
                    value="yes"
                    radio
                    onChange={() => updateMetadata({ [meta.name]: true })}
                    checked={value.metadata[meta.name] === true}
                    disabled={disabled}
                    required={meta.required}
                  />

                  <CheckRadio
                    title="No"
                    name={meta.name}
                    value="no"
                    radio
                    onChange={() => updateMetadata({ [meta.name]: false })}
                    checked={value.metadata[meta.name] === false}
                    disabled={disabled}
                    required={meta.required}
                  />
                </StyledFormRow>
              )}

              {meta.datatype === 'string' && meta.name === 'demographic-employment' && (
                <Select
                  name={meta.name}
                  label={meta.message}
                  value={value.metadata[meta.name] || ''}
                  onChange={e => updateMetadata({ [meta.name]: e.target.value })}
                  disabled={disabled}
                  required={meta.required}
                  items={dropdownEmployment}
                />
              )}

              {meta.datatype === 'string' && meta.name === 'demographic-country' && (
                <Select
                  name={meta.name}
                  label={meta.message}
                  value={value.metadata[meta.name] || ''}
                  onChange={e => updateMetadata({ [meta.name]: e.target.value })}
                  disabled={disabled}
                  required={meta.required}
                  items={dropdownCountries}
                />
              )}
            </StyledFormGroup>
          </Fragment>
        ))}
      </StyledFormSection>

      {!!fields.operational && (
        <>
          <Divider type="doubledashed" />
          <StyledFormSection>
            <StyledFormSectionTitle>Operational opt-ins</StyledFormSectionTitle>
            <StyledFormGroup>
              <legend>
                Do you wish to accept operational opt-ins?
                {" "}
                <small>[optional]</small>
                <span>Select all that apply</span>
              </legend>
              
              <StyledFormRow $columns={2}>
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
              </StyledFormRow>
            </StyledFormGroup>
          </StyledFormSection>
        </>
      )}

      {!!fields.marketing && (
        <>
          <Divider type="doubledashed" />
          <StyledFormSection>
            <StyledFormSectionTitle>Marketing opt-ins</StyledFormSectionTitle>
            <StyledFormGroup>
              <legend>
                Do you wish to accept marketing opt-ins?
                {" "}
                <small>[optional]</small>
                <span>Select all that apply</span>
              </legend>

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
              <legend>
                You must accept the terms and conditions to participate.
                {" "}
                <small>[required]</small>
              </legend>

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
