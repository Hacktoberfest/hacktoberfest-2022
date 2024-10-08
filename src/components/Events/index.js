import Event from 'components/Event';
import { StyledEvents, StyledEventsLink } from './Events.styles';
import Divider from 'components/Divider';
import ButtonMain from 'components/ButtonMain';

const Events = (props) => {
  const { events, link } = props;

  return (
    <StyledEvents>
      <ul>
        {events.map((event) => (
          <li key={event.title}>
            <Event
              eyebrow={`[${event.location}]`}
              title={event.title}
              content={event.content}
              date={event.date}
              time={event.time}
              rsvp={event.rsvp}
            />
            <Divider />
          </li>
        ))}
      </ul>
      {link && (
        <StyledEventsLink>
          <ButtonMain size="lg" {...link} />
        </StyledEventsLink>
      )}
    </StyledEvents>
  );
};

export default Events;
