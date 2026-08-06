import { answerText, mission } from 'data/content.mjs';

import {
  Eyebrow,
  MissionCopy,
  MissionHeading,
  MissionInner,
  MissionRoot,
} from './MissionSection.styles';

const MissionSection = () => (
  <MissionRoot id="mission" aria-labelledby="mission-title">
    <MissionInner>
      <div>
        <Eyebrow>{mission.eyebrow}</Eyebrow>
        <MissionHeading id="mission-title">
          {mission.heading.lead} <em>{mission.heading.accent}</em>
        </MissionHeading>
      </div>
      <MissionCopy>
        {mission.paragraphs.map((paragraph) => (
          <p key={answerText(paragraph)}>
            {paragraph.map((segment, index) =>
              segment.bold ? (
                // eslint-disable-next-line react/no-array-index-key
                <strong key={index}>{segment.text}</strong>
              ) : (
                segment.text
              ),
            )}
          </p>
        ))}
      </MissionCopy>
    </MissionInner>
  </MissionRoot>
);

export default MissionSection;
