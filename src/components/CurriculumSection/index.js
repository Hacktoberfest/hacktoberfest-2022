import {
  CurriculumCard,
  CurriculumCardCopy,
  CurriculumCardTitle,
  CurriculumGrid,
  CurriculumHeading,
  CurriculumIntro,
  CurriculumIntroCopy,
  CurriculumNumber,
  CurriculumRoot,
  CurriculumTag,
  CurriculumTags,
  Eyebrow,
} from './CurriculumSection.styles';

const CARDS = [
  {
    number: '01 / MODELS',
    title: 'Start with an open model',
    copy: 'Download a model with open weights and run it. See what it can do on hardware you control.',
    tags: ['weights', 'licenses', 'evaluation'],
  },
  {
    number: '02 / TOOLS',
    title: 'Swap in open tools',
    copy: 'Go up the stack: run your model through an open source harness — agents, retrieval, evals — and change the parts instead of treating the system as one black box.',
    tags: ['agents', 'RAG', 'evals'],
  },
  {
    number: '03 / INFRASTRUCTURE',
    title: 'Own your inference',
    copy: 'Serve a model locally or on your own infrastructure. Learn what quantization, latency, and cost actually mean in practice.',
    tags: ['local', 'cloud', 'quantization'],
  },
  {
    number: '04 / PRACTICE',
    title: 'Ship and show it',
    copy: 'Build something another developer can run — then demo it at your Fest or share it online.',
    tags: ['build', 'demo', 'share'],
  },
];

const CurriculumSection = () => (
  <CurriculumRoot id="explore">
    <CurriculumIntro>
      <div>
        <Eyebrow>What you&apos;ll build</Eyebrow>
        <CurriculumHeading>
          Go under the hood of <em>modern AI.</em>
        </CurriculumHeading>
      </div>
      <CurriculumIntroCopy>
        There&apos;s more to AI than the handful of chatbots everyone knows.
        This October, you&apos;ll work with the open ecosystem underneath.
      </CurriculumIntroCopy>
    </CurriculumIntro>

    <CurriculumGrid>
      {CARDS.map((card) => (
        <CurriculumCard key={card.number}>
          <CurriculumNumber>{card.number}</CurriculumNumber>
          <div>
            <CurriculumCardTitle>{card.title}</CurriculumCardTitle>
            <CurriculumCardCopy>{card.copy}</CurriculumCardCopy>
          </div>
          <CurriculumTags aria-label="Topics">
            {card.tags.map((tag) => (
              <CurriculumTag key={tag}>{tag}</CurriculumTag>
            ))}
          </CurriculumTags>
        </CurriculumCard>
      ))}
    </CurriculumGrid>
  </CurriculumRoot>
);

export default CurriculumSection;
