import { Box, Toolbar } from '@mui/material';
import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
}

const drawerWidth = 260;

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        bgcolor: 'background.default',
        minHeight: '100vh',
      }}
    >
      <Toolbar /> {/* Spacer for AppBar */}
      {children}
    </Box>
  );
}

