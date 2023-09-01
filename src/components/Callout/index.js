import Container from 'components/Container';
import {
  StyledCallout
} from './Callout.styles';
import ButtonMain from 'components/ButtonMain';
import { MarkdownInline } from 'components/markdown';

const Callout = props => {
  const { children, link } = props;
  return (
    <StyledCallout {...props}>
      <Container inner>
        <MarkdownInline string={children} />
        {link && (
          <p>
            <ButtonMain size="lg" {...link} />
          </p>
        )}
      </Container>
    </StyledCallout>
  );
};

export default Callout;