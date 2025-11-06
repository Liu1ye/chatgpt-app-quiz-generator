'use client';

import { useOpenAIGlobal } from '@/app/hooks';
import '@/app/i18n';
import i18next from 'i18next';
import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/app/i18n';

const InitialComp = ({children}: {children: React.ReactNode}) => {
    const locale = useOpenAIGlobal("locale");
    const theme = useOpenAIGlobal("theme");

    useEffect(() => {
        if (locale) {
            i18next.changeLanguage(locale as string);
        }
    }, [locale]);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}

export default InitialComp;