import { Box, Toolbar, Container } from '@mui/material';
import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  disablePadding?: boolean;
}

const drawerWidth = 280;

export default function PageLayout({ 
  children, 
  maxWidth = 'xl',
  disablePadding = false 
}: PageLayoutProps) {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        bgcolor: 'background.default',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Spacer for AppBar with enhanced height */}
      <Box sx={{ height: { xs: 64, md: 72 } }} />
      
      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          py: disablePadding ? 0 : { xs: 2.5, sm: 3, md: 4 },
          px: disablePadding ? 0 : { xs: 2, sm: 3, md: 4 },
        }}
      >
        {maxWidth !== false ? (
          <Container 
            maxWidth={maxWidth}
            sx={{
              px: { xs: 0, sm: 0 },
            }}
          >
            {children}
          </Container>
        ) : (
          children
        )}
      </Box>
    </Box>
  );
}

