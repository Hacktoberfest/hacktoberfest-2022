import ContentMaster from 'components/ContentMaster';
import { StyledListWrapper, StyledList } from './List.styles';

const List = (props) => {
  const { content, list } = props;
  return (
    <StyledListWrapper>
      <ContentMaster {...content} />
      <ContentMaster size="md" list={list} />
    </StyledListWrapper>
  );
};

export default List;
