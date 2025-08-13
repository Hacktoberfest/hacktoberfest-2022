import ContentMaster from 'components/ContentMaster';
import {
  StyledEvent,
  StyledEventContent,
  StyledContent,
  StyledRSVP,
  StyledEventHeading,
} from './Event.styles';
import { MarkdownInline } from 'components/markdown';
import ButtonMain from 'components/ButtonMain';

const Event = (props) => {
  const { title, content, date, time, location, rsvp, buttonVariant } = props;
  return (
    <StyledEvent>
      <StyledEventContent>
        <ContentMaster
          size="sm"
          title={<StyledEventHeading>{title}</StyledEventHeading>}
          titleTag="h3"
          hasCaret={false}
        />

        <StyledContent>
          <MarkdownInline string={content} />

          <ul>
            {date && <li>Date: {date}</li>}
            {time && <li>Time: {time}</li>}
            {location && <li>Location: {location}</li>}
          </ul>
        </StyledContent>
      </StyledEventContent>
      <StyledRSVP $missing={!rsvp}>
        {rsvp ? (
          <ButtonMain
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
