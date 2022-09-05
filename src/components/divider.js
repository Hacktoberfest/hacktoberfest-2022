import styled from 'styled-components';

const StyledDiv = styled.div``;

const DividerWrapper = styled(StyledDiv)`
  align-items: center;
  display: flex;
  height: 16px;
  position: relative;
  width: 100%;
  filter: ${(props) => props.theme.glowLiteDS};

  &.reverse {
    transform: scaleX(-1);
  }

  .long {
    align-self: flex-end;
    background: ${(props) => props.theme.text};
    height: 1px;
    width: 50%;
  }

  .angled_wrapper {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    overflow: hidden;
    width: 16px;

    .angled {
      background: ${(props) => props.theme.text};
      height: 1px;
      position: absolute;
      transform: rotate(-45deg);
      width: 22px;
    }
  }

  .short {
    align-self: flex-start;
    background: ${(props) => props.theme.text};
    height: 1px;
    width: 50%;
  }

  .garnish_wrapper {
    display: flex;
    gap: 4px;
    height: 4px;
    left: 0;
    position: absolute;
    top: 0;
    width: 20%;

    .garnish {
      background: ${(props) => props.theme.text};
      height: 100%;

      &.short {
        width: 25%;
      }

      &.long {
        width: 75%;
      }
    }
  }
`;

export const Garnish = () => {
  return (
    <div className="garnish_wrapper">
      <div className="garnish-1" />
      <div className="garnish-2" />
      <div className="garnish-3" />
    </div>
  );
};

const Divider = (props) => {
  return (
    <DividerWrapper className={props.style}>
      <div className="garnish_wrapper">
        <div className="garnish short" />
        <div className="garnish short" />
        <div className="garnish long" />
      </div>
      <div className="long" />
      <div className="angled_wrapper">
        <div className="angled" />
      </div>
      <div className="short" />
    </DividerWrapper>
  );
};

export default Divider;
