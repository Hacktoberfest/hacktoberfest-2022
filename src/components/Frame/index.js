import { useTheme } from 'styled-components';

const Frame = ({color = 'gold'}) => {
  const theme = useTheme();

  let colorTheme = {};

  if(color === 'gold') {
    colorTheme = {
      color1: theme.colors.bavarian.gold100,
      color2: theme.colors.bavarian.gold200,
      color3: theme.colors.bavarian.gold300,
      color4: theme.colors.bavarian.gold400,
      baseColor: theme.colors.neutral.void200
    }
  }

  if(color === 'blue') {
    colorTheme = {
      color1: theme.colors.bavarian.blue100,
      color2: theme.colors.bavarian.blue200,
      color3: theme.colors.bavarian.blue300,
      color4: theme.colors.bavarian.blue400,
      baseColor: theme.colors.neutral.void200
    }
  }

  if(color === 'red') {
      colorTheme = {
        color1: theme.colors.bavarian.red100,
        color2: theme.colors.bavarian.red200,
        color3: theme.colors.bavarian.red300,
        color4: theme.colors.bavarian.red400,
        baseColor: theme.colors.neutral.void200
      }
    }

  return (
    <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M150 20H160V10L150 10V20Z" fill={colorTheme.color1}/>
      <path d="M110 20H120V10L110 10V20Z" fill={colorTheme.color1}/>
      <path d="M140 10L150 10V0L140 0V10Z" fill={colorTheme.color1}/>
      <path d="M80 30H90V20H80V30Z" fill={colorTheme.color3}/>
      <path d="M50 20H60V10L50 10V20Z" fill={colorTheme.color1}/>
      <path d="M60 30H70V20H60V30Z" fill={colorTheme.color3}/>
      <path d="M140 30H150V20H140V30Z" fill={colorTheme.color2}/>
      <path d="M170 20H180V10L170 10V20Z" fill={colorTheme.color1}/>
      <path d="M160 30H170V20H160V30Z" fill={colorTheme.color2}/>
      <path d="M110 220L100 220L100 230L110 230L110 220Z" fill={colorTheme.color4}/>
      <path d="M120 220L110 220L110 230L120 230L120 220Z" fill={colorTheme.color4}/>
      <path d="M130 210L120 210L120 220L130 220L130 210Z" fill={colorTheme.color2}/>
      <path d="M180 210L170 210L170 220L180 220L180 210Z" fill={colorTheme.color4}/>
      <path d="M140 220L130 220L130 230L140 230L140 220Z" fill={colorTheme.color4}/>
      <path d="M190 220L180 220L180 230L190 230L190 220Z" fill={colorTheme.color3}/>
      <path d="M220 200L210 200L210 210L220 210L220 200Z" fill={colorTheme.color4}/>
      <path d="M230 220L220 220L220 230L230 230L230 220Z" fill={colorTheme.color3}/>
      <path d="M150 230L140 230L140 240L150 240L150 230Z" fill={colorTheme.color3}/>
      <path d="M60 230L50 230L50 240L60 240L60 230Z" fill={colorTheme.baseColor}/>
      <path d="M100 220L90 220L90 230L100 230L100 220Z" fill={colorTheme.color3}/>
      <path d="M100 210L90 210L90 220L100 220L100 210Z" fill={colorTheme.color2}/>
      <path d="M70 230L60 230L60 240L70 240L70 230Z" fill={colorTheme.color4}/>
      <path d="M80 220L70 220L70 230L80 230L80 220Z" fill={colorTheme.color4}/>
      <path d="M70 210L60 210L60 220L70 220L70 210Z" fill={colorTheme.color4}/>
      <path d="M80 230L70 230L70 240L80 240L80 230Z" fill={colorTheme.baseColor}/>
      <path d="M220 127L220 137L230 137L230 127L220 127Z" fill={colorTheme.color3}/>
      <path d="M220 117L220 127L230 127L230 117L220 117Z" fill={colorTheme.color1}/>
      <path d="M230 97L230 107L240 107L240 97L230 97Z" fill={colorTheme.color1}/>
      <path d="M220 77L220 87L230 87L230 77L220 77Z" fill={colorTheme.color1}/>
      <path d="M220 137L220 147L230 147L230 137L220 137Z" fill={colorTheme.color2}/>
      <path d="M210 147L210 157L220 157L220 147L210 147Z" fill={colorTheme.color4}/>
      <path d="M230 127L230 137L240 137L240 127L230 127Z" fill={colorTheme.color1}/>
      <path d="M220 157L220 167L230 167L230 157L220 157Z" fill={colorTheme.color4}/>
      <path d="M20 91L20 81L10 81L10 91L20 91Z" fill={colorTheme.color4}/>
      <path d="M10 91L10 81L0 81L-1.31134e-06 91L10 91Z" fill={colorTheme.color4}/>
      <path d="M20 111L20 101L10 101L10 111L20 111Z" fill={colorTheme.color4}/>
      <path d="M20 131L20 121L10 121L10 131L20 131Z" fill={colorTheme.color4}/>
      <path d="M29.9238 171L29.9238 161L19.9238 161L19.9238 171L29.9238 171Z" fill={colorTheme.color4}/>
      <path d="M10 191L10 181L0 181L-1.31134e-06 191L10 191Z" fill={colorTheme.color3}/>
      <path d="M20 181L20 171L10 171L10 181L20 181Z" fill={colorTheme.color4}/>
      <path d="M20 221L20 211L10 211L10 221L20 221Z" fill={colorTheme.color3}/>
      <path d="M30 61L30 51L20 51L20 61L30 61Z" fill={colorTheme.color2}/>
      <path d="M30 111L30 101L20 101L20 111L30 111Z" fill={colorTheme.color4}/>
      <path d="M20 71L20 61L10 61L10 71L20 71Z" fill={colorTheme.color3}/>
      <path d="M20 81L20 71L10 71L10 81L20 81Z" fill={colorTheme.color4}/>
      <path d="M30 81L30 71L20 71L20 81L30 81Z" fill={colorTheme.color3}/>
    </svg>
  );
};

export default Frame;