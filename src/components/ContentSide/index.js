import {
  StyledContentSide,
  StyledContentSideContainer
} from './ContentSide.styles';
import ContentMaster from 'components/ContentMaster';

const ContentSide = props => {
  const {
    children,
    title,
    links
  } = props;

  return (
    <StyledContentSide>
      <StyledContentSideContainer>
        <ContentMaster title={title} size="xl" />
        <ContentMaster
          size="xl"
          links={links}>
          {children}
        </ContentMaster>
      </StyledContentSideContainer>
    </StyledContentSide>
  );
};

export default ContentSide;