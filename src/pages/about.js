import styled, { keyframes } from 'styled-components';

import { council, lowNonCode } from 'lib/about';

import Collapse from 'components/collapse';
import Button from 'components/button';
import Anchor from 'components/anchor';
import Divider from 'components/divider';
import Section from 'components/section';

const textAnimation = () => keyframes`
  50% {
    content: " ->"
  }
  100% {
    content: " -->"
  }
`;

const StyledCouncilMembers = styled.div`
  margin: 32px 0;

  details {
    margin: 24px 0;
    transition: 0.2s ease;
    background: linear-gradient(
      180deg,
      rgba(124, 127, 255, 0) 0%,
      rgba(124, 127, 255, 0.2) 100%
    );
    border: 1px solid ${(props) => props.theme.psybeam};
    border-radius: 24px;

    &:hover {
      box-shadow: 0px 0px 12px ${(props) => props.theme.psybeam};

      summary {
        img {
          transform: rotate(0deg) translateY(-10px) !important;
        }
      }
    }

    div {
      padding-right: 40px;
    }

    ul {
      margin-top: 24px;
    }

    a {
      text-transform: none;
      transition: 0.2s ease;
      font-variant-ligatures: none;
      &:after {
        content: ' >';
      }

      &:hover {
        color: rgba(229, 225, 230, 1);
        &:after {
          filter: ${(props) => props.theme.glowLiteDS};
          animation: ${textAnimation} 1.5s linear infinite;
        }
      }
    }

    &:nth-of-type(2n) {
      summary {
        img {
          transform: rotate(4deg);
        }
      }
    }

    summary {
      flex-wrap: wrap;
      img {
        transition: 0.2s ease;
        transform: rotate(-4deg);
        border-radius: 24px;
        margin-right: 24px;
      }
    }
  }
`;

export const StyledCouncilMemberContent = styled.div`
  margin: 32px 0 32px 64px;
`;

const About = () => {
  return (
    <>
      <Section type="sub_hero">
        <h1>About</h1>
        <h4>Find what you need quickly</h4>
        <div>
          <Button as="a" href="#lore" color_bg="spark">
            Hacktoberfest Lore
          </Button>
          <Button as="a" href="#new-for-2022" color_bg="giga">
            New for 2022
          </Button>
          <Button as="a" href="#low-or-non-code" color_bg="surf">
            Low or Non Code Contributions
          </Button>
          <Button as="a" href="#council" color_bg="psybeam">
            Advisory Council
          </Button>
        </div>
      </Section>

      <Section type="sub_content" id="lore">
        <Divider />
        <Anchor href="#lore" />
        <h2>Hacktoberfest Lore</h2>
        <p>
          Hacktoberfest is DigialOcean’s annual event that encourages people to
          contribute to open source throughout October. Much of modern tech
          infrastructure—including some of DigitalOcean’s own products—relies on
          open-source projects built and maintained by passionate people who
          often don’t have the staff or budgets to do much more than keep the
          project alive. Hacktoberfest is all about giving back to those
          projects, sharpening skills, and celebrating all things open source,
          especially the people that make open source so special.
        </p>
        <p>
          For the past 9 years, thousands of people—coders and non-coders
          alike—have participated in Hacktoberfest to support the projects they
          use and love, learn and practice skills that will enhance their
          careers, and meet new people who love open source as much as they do.
        </p>
      </Section>

      <Section type="sub_content">
        <Divider />
        <h2>New for 2022</h2>

        <Anchor href="#low-or-non-code" id="low-or-non-code" />
        <h3>Low or Non Code Contributions</h3>
        <p>
          Contributing to open source isn’t just for technical folks who want to
          write code. There are lots of opportunities to use your professional
          skills in support of open-source projects. This year, we’re making a
          point to encourage contributions that require some technical
          experience or none at all. No matter your experience, you can
          participate in Hacktoberfest!
        </p>
        <p>
          Hacktoberfest welcomes people of any experience level to participate,
          and low-code and non-code contributions are fantastic choices for
          folks who don’t have a lot of technical knowledge. Here are some
          examples of ways you can contribute to open-source projects:
        </p>

        <table>
          <thead>
            <tr>
              <th />
              <th>Low-Code</th>
              <th>Non-Code</th>
            </tr>
          </thead>
          <tbody>
            {lowNonCode.map((row) => (
              <tr key={row.title}>
                <td>{row.title}</td>
                <td>
                  <ul>
                    {row.low.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul>
                    {row.non.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p>
          <i>
            **To accept Advocacy type contributions Maintainers will need to
            create a specific repo that acts as an activity log and accepts
            PRs/MRs.
          </i>
        </p>
      </Section>

      <Section type="sub_content" id="council">
        <Divider />
        <Anchor href="#council" />
        <h2>Advisory Council</h2>
        <p>
          Each year, we bring together a talented group of open-source superfans
          who help ensure that Hacktoberfest is accessible, inclusive, and
          enriching for both contributors and maintainers.
        </p>
        <StyledCouncilMembers>
          {council.map((member) => (
            <Collapse
              key={member.name}
              title={
                <>
                  <img
                    src={member.image}
                    alt={member.name}
                    width={128}
                    height={128}
                    style={{ objectFit: 'cover' }}
                  />
                  <h3>{member.name}</h3>
                </>
              }
              collapsed
            >
              <StyledCouncilMemberContent>
                <p>{member.role}</p>
                <p>{member.skills}</p>
                <p>{member.bio}</p>
                {!!member.links.length && (
                  <ul>
                    {member.links.map((link) => (
                      <li key={link.title}>
                        <a href={link.url}>{link.title}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </StyledCouncilMemberContent>
            </Collapse>
          ))}
        </StyledCouncilMembers>
      </Section>
    </>
  );
};

export default About;
