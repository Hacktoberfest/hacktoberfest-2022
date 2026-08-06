import { RallyInner, RallyRoot, RallyTag, RallyText } from './Rally.styles';

const Rally = () => (
  <RallyRoot aria-label="The idea behind Hacktoberfest 2026">
    <RallyInner>
      <RallyTag>
        The
        <br />
        idea
      </RallyTag>
      <RallyText>
        A healthy AI ecosystem needs open in the mix. This October, the whole
        Hacktoberfest community is <em>building it.</em>
      </RallyText>
    </RallyInner>
  </RallyRoot>
);

export default Rally;
