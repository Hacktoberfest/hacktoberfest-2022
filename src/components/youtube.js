import styled from 'styled-components';

import Card, { MainWrapper } from './card';

const StyledYouTube = styled.div`
  display: flex;
  justify-content: center;
  margin: 64px 0 0;

  ${MainWrapper} {
    width: 100%;
    max-width: 48rem;
    min-width: auto;
    min-height: auto;

    .content {
      line-height: 0;

      iframe {
        display: block;
        position: relative;
        z-index: 1;
        border-radius: 8px;
        width: 100%;
        aspect-ratio: 16/9;
      }
    }
  }
`;

const YouTube = ({ id, title = "" }) => (
  <StyledYouTube>
    <Card primary="giga" secondary="spark">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?modestbranding=1&rel=0`}
        title={`YouTube video player: ${title}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </Card>
  </StyledYouTube>
);

export default YouTube;
