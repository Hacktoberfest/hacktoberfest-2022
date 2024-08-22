import ContentMaster from 'components/ContentMaster';
import {
  StyledEvent,
  StyledEventContent,
  StyledContent,
  StyledRSVP,
} from './Event.styles';
import { MarkdownInline } from 'components/markdown';
import ButtonMain from 'components/ButtonMain';

const Event = (props) => {
  const { eyebrow, title, content, date, time, rsvp, buttonVariant } = props;
  return (
    <StyledEvent>
      <StyledEventContent>
        <ContentMaster
          size="lg"
          eyebrow={eyebrow}
          title={title}
          titleTag="h3"
          hasCaret={false}
        />

        <StyledContent>
          <MarkdownInline string={content} />

          <ul>
            {date && <li>Date: {date}</li>}
            {time && <li>Time: {time}</li>}
          </ul>
        </StyledContent>
      </StyledEventContent>
      <StyledRSVP $missing={!rsvp}>
        {rsvp ? (
          <ButtonMain
            variant={buttonVariant ? buttonVariant : 'primary-black'}
            href={rsvp.href}
            target="_blank"
            rel="noreferrer noopener"
          >
            {rsvp.text || 'Register'}
          </ButtonMain>
        ) : (
          'Coming Soon'
        )}
      </StyledRSVP>
    </StyledEvent>
  );
};

export default Event;
