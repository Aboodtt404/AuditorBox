import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuditDataContextType {
    forms: Record<string, any> | null;
    fields: Record<string, any[]> | null;
    isLoading: boolean;
    error: Error | null;
}

const AuditDataContext = createContext<AuditDataContextType>({
    forms: null,
    fields: null,
    isLoading: true,
    error: null,
});

export const useAuditData = () => useContext(AuditDataContext);

export const AuditDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [forms, setForms] = useState<Record<string, any> | null>(null);
    const [fields, setFields] = useState<Record<string, any[]> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [formsRes, fieldsRes] = await Promise.all([
                    fetch('/data/forms.json'),
                    fetch('/data/fields.json')
                ]);

                if (!formsRes.ok) throw new Error('Failed to load forms data');
                if (!fieldsRes.ok) throw new Error('Failed to load fields data');

                const formsData = await formsRes.json();
                const fieldsData = await fieldsRes.json();

                setForms(formsData);
                setFields(fieldsData);
            } catch (err) {
                console.error('Error loading audit data:', err);
                setError(err instanceof Error ? err : new Error('Unknown error loading data'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <AuditDataContext.Provider value={{ forms, fields, isLoading, error }}>
            {children}
        </AuditDataContext.Provider>
    );
};
