import { ReactNode, useMemo, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useTranslation } from 'react-i18next';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import baseTheme from './theme';

interface Props {
  children: ReactNode;
}

// Create RTL cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [rtlPlugin],
});

// Create LTR cache
const cacheLtr = createCache({
  key: 'muiltr',
});

export const CustomThemeProvider = ({ children }: Props) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  // Update document direction
  useEffect(() => {
    document.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [isRtl, i18n.language]);

  // Create theme with direction
  const theme = useMemo(
    () =>
      createTheme({
        ...baseTheme,
        direction: isRtl ? 'rtl' : 'ltr',
        typography: {
          ...baseTheme.typography,
          fontFamily: isRtl
            ? '"Cairo", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif'
            : '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
        },
      }),
    [isRtl]
  );

  return (
    <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </CacheProvider>
  );
};

