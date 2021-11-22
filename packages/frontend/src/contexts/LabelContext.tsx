import React, { useState, useContext, useEffect } from 'react';
import { Option } from '../components/SelectInput';

interface LabelContext {
  labels: Option[];
  actions: {
    refetch: () => Promise<void>;
  };
}

const initialContext = {
  actions: {
    refetch: async () => undefined,
  },
  labels: [],
};

export const labelContext = React.createContext<LabelContext>(initialContext);

export const labelProvider: React.FC = ({ children }) => {
  const [labels, setLabels] = useState<Option[]>([]);

  const refetch = async () => {
    const tagRequest = await fetch('/api/label', {
      headers: {
        'content-type': 'application/json',
      },
    });
    const resJson = await tagRequest.json();

    setLabels(resJson.data);
  };

  useEffect(() => {
    (async () => {
      await refetch();
    })();
  }, []);

  return (
    <labelContext.Provider
      value={{
        actions: {
          refetch,
        },
        labels,
      }}
    >
      {children}
    </labelContext.Provider>
  );
};
