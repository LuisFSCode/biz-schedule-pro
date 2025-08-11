import { createContext, useContext, useState } from "react";

const IntegrationsContext = createContext<any>(null);

export function IntegrationsProvider({ children }: { children: React.ReactNode }) {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [integrationTypeToAdd, setIntegrationTypeToAdd] = useState<string | null>(null);
  const [showIntegrationSelector, setShowIntegrationSelector] = useState(false);
  const [integrationWarning, setIntegrationWarning] = useState<string | null>(null);
  const [integrationToAdd, setIntegrationToAdd] = useState<string | null>(null);

  const integrationOptions = [
    { id: 'n8n', name: 'N8N', type: 'n8n' },
    { id: 'typebot', name: 'Typebot', type: 'typebot' },
    { id: 'evolution-api', name: 'Evolution API', type: 'evolution-api' },
  ];

  return (
    <IntegrationsContext.Provider value={{
      integrations, setIntegrations,
      integrationTypeToAdd, setIntegrationTypeToAdd,
      showIntegrationSelector, setShowIntegrationSelector,
      integrationWarning, setIntegrationWarning,
      integrationToAdd, setIntegrationToAdd,
      integrationOptions
    }}>
      {children}
    </IntegrationsContext.Provider>
  );
}

export function useIntegrations() {
  return useContext(IntegrationsContext);
}