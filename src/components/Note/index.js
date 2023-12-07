import ContentMaster from 'components/ContentMaster';
import { StyledNote, StyledNoteImage } from './Note.styles';

const Note = (props) => {
  const { children, image } = props;
  return (
    <StyledNote>
      <StyledNoteImage>
        <img {...image} />
      </StyledNoteImage>
      <ContentMaster size="md">{children}</ContentMaster>
    </StyledNote>
  );
};

export default Note;
