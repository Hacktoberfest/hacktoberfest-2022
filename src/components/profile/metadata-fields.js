import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import countryList from 'country-list';
import styled from 'styled-components';

import {
  breakpoints as bp,
  determineMediaQuery as mQ,
} from 'themes/breakpoints';
import { headline32, textLg, textXl } from 'themes/typography';

import { employmentRoles } from 'lib/profile';

import Input from 'components/Input';
import Select from 'components/Select';
import Divider from 'components/Divider';

import CheckRadio from './check-radio';
import EmailWarning from './email-warning';
import Section from 'components/Section';
import ContentMaster from '../ContentMaster';

const StyledSmallSection = styled(Section)`
  padding-top: 64px;

  ${mQ(bp.desktop)} {
    padding-top: 80px;
  }
`;

const StyledLastSection = styled(Section)`
  &:last-of-type {
    padding-bottom: 40px;

    ${mQ(bp.desktop)} {
      padding-bottom: 80px;
    }
  }
`;

const StyledFormSection = styled.div`
  display: flex;
  gap: 40px;
  flex-direction: column;

  ${mQ(bp.tablet)} {
    gap: 64px;
  }
`;

const StyledFormGroup = styled.fieldset`
  margin: 0;
  border: 0;
  padding: 0;

  legend {
    color: ${({ theme }) => theme.colors2025.space.white};
    padding: 0;
    margin: 0 0 40px;
    display: block;
    width: 100%;
    ${textXl};
    font-weight: 700;

    span {
      color: ${({ theme }) => theme.colors2025.blueViolet};
      ${textLg};
      font-weight: 700;
    }

    ${mQ(bp.tablet)} {
      margin-bottom: 48px;
    }
  }
`;

const StyledFormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;

  ${mQ(bp.tablet)} {
    grid-template-columns: repeat(
      ${({ $columns }) => $columns},
      minmax(0, 1fr)
    );
    gap: ${({ $columns }) => ($columns === 3 ? '88px' : '32px')};
    row-gap: 32px;
    ${({ $rowGap }) => $rowGap === 'sm' && 'row-gap: 16px'};
    ${({ $rowGap }) => $rowGap === 'md' && 'row-gap: 24px'};
    align-items: flex-start;
  }

  ${({ $isSmall }) =>
    $isSmall &&
    `
    width: fit-content;
  `}
`;

const StyledSecondColumn = styled.div`
  ${mQ(bp.tablet)} {
    grid-column-start: 2;
  }
`;

const StyledDivider = styled(Divider)`
  color: ${({ theme }) => theme.colors2025.eastBay};
`;

const StyledFullDivider = styled(Divider)`
  color: ${({ theme }) => theme.colors2025.eastBay};
  grid-column: full-start / full-end;
  width: 100%;
`;

const dropdownEmployment = employmentRoles
  .map((role) => [role, role])
  .concat([['', 'Prefer not to say']]);

const countryOverrides = {
  tw: 'Taiwan',
};

const dropdownCountries = [
  {
    code: '',
    name: 'Prefer not to say',
  },
]
  .concat(
    Object.entries(countryList.getCodeList())
      .map(([code, name]) => ({ code, name: countryOverrides[code] || name }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  )
  .map((country) => [country.code, country.name]);

const MetadataFields = ({
  emails,
  metadata,
  exclude,
  value,
  onChange,
  disabled = false,
}) => {
  const [fields, setFields] = useState({});

  // Group the metadata by category
  useEffect(() => {
    // Group the metadata by category for the UI
    const groupedMetadata = metadata.reduce(
      (obj, item) => ({
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
      }),
      {},
    );

    // Drop any categories we don't want to show
    if (exclude) {
      for (const category of exclude) {
        delete groupedMetadata[category];
      }
    }

    // Sort the categories by position
    for (const key in groupedMetadata) {
      groupedMetadata[key].sort((a, b) => a.position - b.position);
      groupedMetadata[key] = groupedMetadata[key].map((item) => item.item);
    }

    setFields(groupedMetadata);
  }, [metadata, exclude]);

  // Check if emails are to be shown
  const showEmail = useMemo(
    () => !!emails.length && !exclude?.includes('email'),
    [emails, exclude],
  );

  // Ensure we can update values easily
  const updateMetadata = useCallback(
    (obj) => {
      onChange({ ...value, metadata: { ...value.metadata, ...obj } });
    },
    [onChange, value],
  );

  // Allow a user to opt-out of all marketing with a single click
  const marketingOptOut = useCallback(
    (e) => {
      e.preventDefault();
      if (disabled) return;
      if (!e.target.checked) return;

      // Determine what we need to change
      const changes = fields.marketing.reduce(
        (obj, item) => ({
          ...obj,
          ...(value.metadata[item.name] ? { [item.name]: false } : {}),
        }),
        {},
      );

      // If no changes, don't update, so we don't infinite loop
      if (!Object.keys(changes).length) return;

      // Update the values
      updateMetadata(changes);
    },
    [fields, updateMetadata, value],
  );

  // Check the opt-out checkbox automatically based on opt-in states
  const marketingOptedOut = useMemo(
    () => fields.marketing?.every((key) => !value.metadata[key.name]),
    [fields, value],
  );

  return (
    <>
      <StyledSmallSection>
        <StyledFormSection>
          <ContentMaster title="Self-identification" size="md" />

          <StyledFormRow $columns={2} $rowGap="sm">
            <Input
              name="name"
              label="Name"
              labelSize="xl"
              value={value.name}
              onChange={(e) => onChange({ ...value, name: e.target.value })}
              disabled={disabled}
              required
            />

            {showEmail && (
              <>
                <Select
                  name="email"
                  label="Email"
                  labelSize="xl"
                  value={value.email}
                  onChange={(e) =>
                    onChange({ ...value, email: e.target.value })
                  }
                  disabled={disabled}
                  required
                  items={emails.map((email) => [email, email])}
                />
                <StyledSecondColumn>
                  <EmailWarning email={value.email} />
                </StyledSecondColumn>
              </>
            )}
          </StyledFormRow>

          {!!fields.stage && (
            <>
              <StyledFormGroup>
                <legend>What is your experience level?</legend>

                <StyledFormRow $columns={3}>
                  {fields.stage.map((meta) => (
                    <CheckRadio
                      key={meta.name}
                      title={meta.title}
                      message={meta.message}
                      radio
                      name="stage"
                      id="stage"
                      value={meta.name}
                      onChange={(e) =>
                        updateMetadata(
                          fields.stage.reduce(
                            (obj, item) => ({
                              ...obj,
                              [item.name]:
                                meta.name === item.name && e.target.checked,
                            }),
                            {},
                          ),
                        )
                      }
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
              <StyledDivider type="solid" />
              <StyledFormGroup>
                <legend>
                  How would you like to contribute? (select all that apply)
                </legend>

                <StyledFormRow $columns={2}>
                  {fields.type.map((meta) => (
                    <CheckRadio
                      key={meta.name}
                      title={meta.title}
                      message={meta.message}
                      name={meta.name}
                      onChange={(e) =>
                        updateMetadata({ [meta.name]: e.target.checked })
                      }
                      checked={value.metadata[meta.name]}
                      disabled={disabled}
                    />
                  ))}
                </StyledFormRow>
              </StyledFormGroup>
            </>
          )}

          {!!fields.demographic &&
            fields.demographic.map((meta) => (
              <Fragment key={meta.name}>
                <StyledDivider type="solid" />
                <StyledFormGroup>
                  <legend>{meta.title}</legend>

                  {meta.datatype === 'boolean' && (
                    <StyledFormRow $isSmall $columns={2}>
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

                  {meta.datatype === 'string' &&
                    meta.name === 'demographic-employment' && (
                      <StyledFormRow $rowGap="md" $columns={3}>
                        {dropdownEmployment.map(([val, label]) => (
                          <CheckRadio
                            key={val}
                            title={label}
                            titleSize="small"
                            name={meta.name}
                            value={val}
                            radio
                            onChange={() =>
                              updateMetadata({ [meta.name]: val })
                            }
                            checked={value.metadata[meta.name] === val}
                            disabled={disabled}
                            required={meta.required}
                          />
                        ))}
                      </StyledFormRow>
                    )}

                  {meta.datatype === 'string' &&
                    meta.name === 'demographic-country' && (
                      <Select
                        name={meta.name}
                        label=""
                        value={value.metadata[meta.name] || ''}
                        onChange={(e) =>
                          updateMetadata({ [meta.name]: e.target.value })
                        }
                        disabled={disabled}
                        required={meta.required}
                        items={dropdownCountries}
                      />
                    )}
                </StyledFormGroup>
              </Fragment>
            ))}
        </StyledFormSection>
      </StyledSmallSection>

      {!!fields.marketing && (
        <>
          <StyledFullDivider />
          <StyledLastSection>
            <StyledFormSection>
              <ContentMaster title="Marketing opt-ins" size="md" />
              <StyledFormGroup>
                <legend>
                  Do you wish to accept marketing opt-ins? (select all that
                  apply) <span>[Required]</span>
                </legend>

                <StyledFormRow $columns={2}>
                  {fields.marketing.map((meta) => (
                    <CheckRadio
                      key={meta.name}
                      title={meta.title}
                      message={meta.message}
                      name={meta.name}
                      onChange={(e) =>
                        updateMetadata({ [meta.name]: e.target.checked })
                      }
                      checked={value.metadata[meta.name]}
                      disabled={disabled}
                    />
                  ))}

                  <CheckRadio
                    title="Don't Email Me"
                    message="I do not wish to receive any marketing updates from Hacktoberfest’s sponsors."
                    name="marketing-disabled"
                    onChange={marketingOptOut}
                    checked={marketingOptedOut}
                    disabled={disabled}
                  />
                </StyledFormRow>
              </StyledFormGroup>
            </StyledFormSection>
          </StyledLastSection>
        </>
      )}

      {!!fields.agree && (
        <>
          <StyledFullDivider />
          <StyledLastSection>
            <StyledFormSection>
              <ContentMaster title="Rules/terms" size="md" />
              <StyledFormGroup>
                <legend>
                  You must accept the terms and conditions to participate.{' '}
                  <span>[Required]</span>
                </legend>

                <StyledFormRow $columns={2}>
                  {fields.agree.map((meta) => (
                    <CheckRadio
                      key={meta.name}
                      titleSize="small"
                      titleIsBasic
                      title={meta.title}
                      message={meta.message}
                      name={meta.name}
                      onChange={(e) =>
                        updateMetadata({ [meta.name]: e.target.checked })
                      }
                      checked={value.metadata[meta.name]}
                      disabled={disabled}
                      required
                    />
                  ))}
                </StyledFormRow>
              </StyledFormGroup>
            </StyledFormSection>
          </StyledLastSection>
        </>
      )}
    </>
  );
};

export default MetadataFields;
