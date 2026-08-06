import { timeline } from 'data/content.mjs';

import {
  Eyebrow,
  TimelineCard,
  TimelineCardCopy,
  TimelineCardTitle,
  TimelineGrid,
  TimelineHeading,
  TimelineIntro,
  TimelineIntroCopy,
  TimelineRoot,
  TimelineYear,
} from './TimelineSection.styles';

const TimelineSection = () => (
  <TimelineRoot id="history" aria-labelledby="history-title">
    <TimelineIntro>
      <div>
        <Eyebrow>{timeline.eyebrow}</Eyebrow>
        <TimelineHeading id="history-title">
          {timeline.heading.lead} <em>{timeline.heading.accent}</em>
        </TimelineHeading>
      </div>
      <TimelineIntroCopy>{timeline.intro}</TimelineIntroCopy>
    </TimelineIntro>

    <TimelineGrid>
      {timeline.eras.map((era) => (
        <TimelineCard key={era.year}>
          <TimelineYear>{era.year}</TimelineYear>
          <TimelineCardTitle>{era.title}</TimelineCardTitle>
          <TimelineCardCopy>{era.copy}</TimelineCardCopy>
        </TimelineCard>
      ))}
    </TimelineGrid>
  </TimelineRoot>
);

export default TimelineSection;
