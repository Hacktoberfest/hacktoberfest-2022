import {
  StyledDividerRow
} from './DividerRow.styles';

const DividerRow = props => {
  const { children, gap = '64px' } = props;
  return (
    <StyledDividerRow $gap={gap}>
      {children}
    </StyledDividerRow>
  );
};

export default DividerRow;