import { useCallback, useRef, useState } from 'react';
import Form from 'components/form';
import ContentMaster from 'components/ContentMaster';
import {
  StyledFormSection,
  StyledFormContent,
  StyledFormThanks,
  StyledSubmitWrapper,
  StyledFormHeader,
} from './SponsorForm.styles';
import Input from 'components/Input';
import Select from 'components/Select';
import ButtonMain from 'components/ButtonMain';
import logoHacktoberfest from 'assets/img/logo-hacktoberfest-11--submitted.svg';
import Image from 'next/image';

const SponsorForm = () => {
  const ref = useRef();
  const form = useRef();

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    name: '',
    company: '',
    email: '',
    tiers: '',
  });

  const handleChange = (field, value) => {
    setData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const submit = useCallback(
    async (e) => {
      e.preventDefault();

      setSubmitting(true);
      setError(null);
      setSuccess(false);

      try {
        const response = await fetch('/api/sponsor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to submit the form');
        }

        const result = await response.json();
        console.log('Form submitted successfully:', result);

        setSuccess(true);
      } catch (err) {
        console.error('Error submitting form:', err);
        setError(
          'An error occurred while submitting your sponsorship request. Please try again later.',
        );
      } finally {
        setSubmitting(false);
        form.current?.scrollIntoView();
      }
    },
    [data],
  );

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
          <Form
            ref={form}
            onSubmit={submit}
            success={
              success && 'Your Hacktoberfest registration has been saved.'
            }
            error={error}
          >
            <StyledFormContent>
              <Input
                name="name"
                label="Name"
                value={data.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Full name"
                required
              />

              <Input
                name="company"
                label="Company"
                value={data.company}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder="Company name"
                required
              />

              <Input
                name="email"
                label="Email address"
                type="email"
                value={data.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Email address"
                required
              />

              <Select
                name="tiers"
                label="Sponsor tier"
                value={data.tiers || ''}
                onChange={(e) => handleChange('tiers', e.target.value)}
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
        </>
      )}
    </StyledFormSection>
  );
};

export default SponsorForm;
