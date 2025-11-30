import { Box, BoxProps } from '@mui/material';

interface LogoProps extends BoxProps {
  variant?: 'default' | 'white' | 'dark';
  height?: number | string;
}

/**
 * Reusable Logo component for AuditorBox
 * 
 * @param variant - 'default' for transparent logo, 'white' for white logo, 'dark' for dark logo
 * @param height - Height of the logo (width is auto-calculated)
 */
const Logo = ({ variant = 'default', height = 40, sx = {}, ...props }: LogoProps) => {
  const getLogoStyles = () => {
    switch (variant) {
      case 'white':
        return {
          filter: 'brightness(0) invert(1)',
        };
      case 'dark':
        return {
          filter: 'brightness(0)',
        };
      case 'default':
      default:
        return {};
    }
  };

  // Always use transparent logo
  const logoSrc = '/images/transparent-logo.svg';

  return (
    <Box
      component="img"
      src={logoSrc}
      alt="AuditorBox Logo"
      sx={{
        height,
        width: 'auto',
        ...getLogoStyles(),
        ...sx,
      }}
      {...props}
    />
  );
};

export default Logo;


