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
  const { title, content, date, time, location, rsvp, details, link } = props;
  return (
    <StyledEvent>
      <StyledEventContent>
        <ContentMaster
          size="sm"
          title={<StyledEventHeading>{title}</StyledEventHeading>}
          titleTag="h3"
        />

        <StyledContent>
          <MarkdownInline string={content} />

          <ul>
            {details && <li>Details: {details}</li>}
            {date && <li>Date: {date}</li>}
            {time && <li>Time: {time}</li>}
            {location && <li>Location: {location}</li>}
            {link && <li>Link to register: {link}</li>}
          </ul>
        </StyledContent>
      </StyledEventContent>
      <StyledRSVP $missing={!rsvp}>
        {rsvp && (
          <ButtonMain
            href={rsvp.href}
            target="_blank"
            rel="noreferrer noopener"
          >
            {rsvp.text || 'Register'}
          </ButtonMain>
        )}
      </StyledRSVP>
    </StyledEvent>
  );
};

export default Event;
