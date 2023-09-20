import ContentMaster from 'components/ContentMaster';
import { StyledEvent, StyledContent, StyledRSVP } from './Event.styles';
import { MarkdownInline } from 'components/markdown';

const Event = props => {
  const {
    eyebrow,
    title,
    content,
    date,
    time,
    rsvp,
  } = props;
  return (
    <StyledEvent>
      <ContentMaster
        size="lg"
        eyebrow={eyebrow}
        title={title}
        titleTag="h3"
      />

      <StyledContent>
        <MarkdownInline string={content} />
      </StyledContent>

      <ul>
        {date && <li>Date: {date}</li>}
        {time && <li>Time: {time}</li>}
      </ul>

      <StyledRSVP $missing={!rsvp}>
        {rsvp
          ? (
            <a
              href={rsvp.href}
              target="_blank"
              rel="noreferrer noopener"
            >
              {rsvp.text || 'Register'}
            </a>
          )
          : 'Coming Soon'}
        </StyledRSVP>
    </StyledEvent>
  );
};

export default Event;
