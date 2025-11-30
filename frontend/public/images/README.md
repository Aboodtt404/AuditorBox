# AuditorBox Logo Assets

This directory contains the official AuditorBox logo files in various formats.

## Available Logo Files

### SVG Formats (Recommended for Web)
- **`colored-logo.svg`** - Full color logo with dark blue background
- **`transparent-logo.svg`** - Logo text on transparent background

### PNG Formats (Raster Images)
- **`colored-logo.png`** - Full color logo with dark blue background (362KB)
- **`transparent-logo.png`** - Logo text on transparent background (348KB)

### PDF Formats (Print/Vector)
- **`colored-logo.pdf`** - Full color logo with dark blue background (320KB)
- **`transparent-logo.pdf`** - Logo text on transparent background (385KB)

## Usage in React Components

The recommended way to use logos in the application is through the `Logo` component:

```tsx
import Logo from '../components/Logo';

// Colored version (default)
<Logo variant="colored" height={40} />

// White version (for dark backgrounds)
<Logo variant="white" height={50} />

// Dark version (for light backgrounds)
<Logo variant="dark" height={60} />

// With custom styles
<Logo 
  variant="white" 
  height="auto" 
  sx={{ 
    width: '100%', 
    opacity: 0.5 
  }} 
/>
```

## Logo Component Props

- **`variant`**: `'colored' | 'white' | 'dark'` (default: `'colored'`)
  - `colored`: Full color logo (uses colored-logo.svg)
  - `white`: White logo for dark backgrounds (uses transparent-logo.svg with white filter)
  - `dark`: Dark logo for light backgrounds (uses transparent-logo.svg with dark filter)

- **`height`**: `number | string` (default: `40`)
  - The height of the logo in pixels
  - Width is automatically calculated to maintain aspect ratio

- **`sx`**: Material-UI `SxProps`
  - Additional styling using MUI's sx prop

## Direct Usage (without Logo component)

If you need to use the logo directly without the Logo component:

```tsx
<Box
  component="img"
  src="/images/colored-logo.svg"
  alt="AuditorBox Logo"
  sx={{
    height: 40,
    width: 'auto',
  }}
/>
```

## Best Practices

1. **Always use SVG format for web** - They scale perfectly at any size
2. **Use the Logo component** - It provides consistent styling and filters
3. **Choose the right variant**:
   - Use `colored` for light backgrounds or standalone display
   - Use `white` for dark/colored backgrounds (navigation sidebar, footer)
   - Use `dark` for very light backgrounds if needed
4. **Maintain aspect ratio** - Set height and let width be auto, or vice versa
5. **Add alt text** - Always provide descriptive alt text for accessibility

## File Locations

- Logo Component: `/frontend/src/components/Logo.tsx`
- Logo Assets: `/frontend/public/images/`
- Favicon: `/frontend/public/favicon.svg`

## Favicon

The favicon is automatically generated from the logo and is used in:
- Browser tabs
- Bookmarks
- Mobile home screen icons
- Social media previews (Open Graph, Twitter Cards)

## Social Media Meta Tags

The logos are configured in the HTML meta tags for social media sharing:
- Open Graph image: `/images/colored-logo.png`
- Twitter Card image: `/images/colored-logo.png`

These can be found in `/frontend/index.html`.


