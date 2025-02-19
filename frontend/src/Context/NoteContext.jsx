import React, { createContext, useState } from 'react';

// Create the context
export const NoteContext = createContext();

// Create a provider component
export const NoteProvider = ({ children }) => {
    const [note, setNote] = useState('');

    return (
        <NoteContext.Provider value={{ note, setNote }}>
            {children}
        </NoteContext.Provider>
    );
};
