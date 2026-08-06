import {
  EraHeading,
  EraLabel,
  EraPanel,
  EraPanelCopy,
  EraPanelTitle,
  EraRoot,
  EraShift,
  Eyebrow,
  SectionCopy,
  SectionHeading,
  ThesisLine,
} from './EraSection.styles';

const PANELS = [
  {
    label: '2014-2025',
    title: 'Open the door to open source.',
    copy: 'A simple pull-request challenge introduced a generation of developers to open source. It worked.',
  },
  {
    label: '2026',
    title: 'Get hands-on with open models, together.',
    copy: 'Meet up in person, run models you can download and inspect, and build something real in a day.',
  },
];

const EraSection = () => (
  <EraRoot id="new-era">
    <SectionHeading>
      <div>
        <Eyebrow>What changes in 2026</Eyebrow>
        <EraHeading>
          Hacktoberfest becomes something you <em>attend.</em>
        </EraHeading>
      </div>
      <SectionCopy>
        <p>
          When Hacktoberfest started, open source had a contributor problem.
          Projects needed people, and a simple pull-request challenge brought
          millions of them in.
        </p>
        <p>
          Today, AI tools have made contributing so easy that maintainers review
          more pull requests than they can handle. Getting new contributors
          isn&apos;t the problem anymore &mdash; understanding the AI behind
          those tools, and keeping it open, is where the community&apos;s energy
          is needed now.
        </p>
        <ThesisLine>
          So this year, Hacktoberfest is hundreds of in-person Fests plus a
          global online event, all about building with open source AI.
        </ThesisLine>
      </SectionCopy>
    </SectionHeading>

    <EraShift aria-label="How Hacktoberfest is changing">
      {PANELS.map((panel) => (
        <EraPanel key={panel.label}>
          <EraLabel>{panel.label}</EraLabel>
          <EraPanelTitle>{panel.title}</EraPanelTitle>
          <EraPanelCopy>{panel.copy}</EraPanelCopy>
        </EraPanel>
      ))}
    </EraShift>
  </EraRoot>
);

export default EraSection;
