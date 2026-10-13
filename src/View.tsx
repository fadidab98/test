import React, {createContext, useContext} from 'react';
export const Context = createContext<{label: string} | null>(null);
export function View() { const store = useContext(Context); if (!store) throw new Error('View requires its Provider'); return <span>{store.label}</span>; }
