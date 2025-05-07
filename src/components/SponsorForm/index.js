import { useCallback, useRef, useState } from 'react';
import Form from 'components/form';
import ContentMaster from 'components/ContentMaster';
import {
  StyledFormSection,
  StyledFormContent,
  StyledFormThanks,
  StyledSubmitWrapper,
  StyledFormHeader,
  StyledFormWrapper,
} from './SponsorForm.styles';
import Input from 'components/Input';
import Select from 'components/Select';
import ButtonMain from 'components/ButtonMain';
import logoHacktoberfest from 'assets/img/logo-hacktoberfest-11--submitted.svg';
import Image from 'next/image';
import useMarketo from 'hooks/useMarketo';

const SponsorForm = () => {
  const ref = useRef();
  const form = useRef();
  const formId = 1892;

  useMarketo({
    formId: formId,
    callback: () => {},
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    FirstName: '',
    Email: '',
    Company__c: '',
    Country__c: 'us',
    hacktoberfestSponsorTier: '',
    utm_campaign__c: '',
    utm_medium__c: '',
    utm_source__c: '',
  });

  const handleChange = (field, value) => {
    setData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setSubmitting(true);
    setSuccess(false);

    window.MktoForms2.getForm(formId)
      .vals(data)
      .onSuccess(() => {
        setSubmitting(false);
        setSuccess(true);

        return false;
      })
      .submit();
  };

  return (
    <StyledFormSection ref={ref}>
      {success ? (
        <StyledFormThanks>
          <Image
            src={logoHacktoberfest}
            alt="Thank You"
            width="140"
            height="68"
          />
          <ContentMaster
            align="center"
            title="Thank you for your interest in sponsoring Hacktoberfest!"
            size="sm"
          >
            One of our team members will be in contact with you soon with more
            details about sponsorship!
          </ContentMaster>
        </StyledFormThanks>
      ) : (
        <>
          <StyledFormHeader>
            <h3>We’d love for you to be a part of Hacktoberfest!</h3>

            <p>
              Fill out the form and a Hacktoberfest team member will reach out
              with more sponsorship information.
            </p>
          </StyledFormHeader>

          <form id={`mktoForm_${formId}`} aria-hidden="true" />

          <StyledFormWrapper>
            <Form
              ref={form}
              onSubmit={handleSubmit}
              success={
                success && 'Your Hacktoberfest registration has been saved.'
              }
              error={error}
            >
              <StyledFormContent>
                <Input
                  name="FirstName"
                  label="Name"
                  value={data.name}
                  onChange={(e) => handleChange('FirstName', e.target.value)}
                  placeholder="Full name"
                  required
                />

                <Input
                  name="Company__c"
                  label="Company"
                  value={data.company}
                  onChange={(e) => handleChange('Company__c', e.target.value)}
                  placeholder="Company name"
                  required
                />

                <Input
                  name="Email"
                  label="Email address"
                  type="email"
                  value={data.email}
                  onChange={(e) => handleChange('Email', e.target.value)}
                  placeholder="Email address"
                  required
                />

                <Select
                  name="hacktoberfestSponsorTier"
                  label="Sponsor tier"
                  value={data.hacktoberfestSponsorTier || ''}
                  onChange={(e) =>
                    handleChange('hacktoberfestSponsorTier', e.target.value)
                  }
                  placeholder={'Sponsorship tiers'}
                  required
                  items={[
                    ['Title Sponsor', 'Title Sponsor'],
                    ['Founder Tier', 'Founder Tier'],
                    ['Maintainer Tier', 'Maintainer Tier'],
                  ]}
                />
              </StyledFormContent>

              <StyledSubmitWrapper $isSuccess={success}>
                <ButtonMain
                  as="button"
                  type="submit"
                  variant={submitting ? 'is-loading' : 'primary'}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting' : 'Submit'}
                </ButtonMain>
              </StyledSubmitWrapper>
            </Form>
          </StyledFormWrapper>
        </>
      )}
    </StyledFormSection>
  );
};

export default SponsorForm;
