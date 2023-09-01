import ContentMaster from 'components/ContentMaster';
import {
  StyledEvent,
  StyledEventInfo
} from './Event.styles';
import { MarkdownInline } from 'components/markdown';

const Event = props => {
  const {
    eyebrow,
    title,
    date,
    time,
    rsvp,
    format
  } = props;
  return (
    <StyledEvent>
      <ContentMaster
        size="lg"
        eyebrow={eyebrow}
        title={title}
        titleTag="h3"
      />

      <StyledEventInfo>
        <ul>
          <li>Date: {date}</li>
          <li>Time: {time}</li>
          <li>
            Location: {rsvp ? (<a href={rsvp} target="_blank" rel="noreferrer noopener">{rsvp}</a>) : 'TBD'}
          </li>
        </ul>
      </StyledEventInfo>
    </StyledEvent>
  );
};

export default Event;