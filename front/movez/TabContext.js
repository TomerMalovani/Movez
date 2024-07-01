// tabContext.js
import React, { createContext, useState, useContext } from 'react';

// Create a context with 'provider' as the default value
const TabContext = createContext();

export const TabProvider = ({ children }) => {
	const [currentTab, setCurrentTab] = useState('provider'); // Default to 'provider'

	return (
		<TabContext.Provider value={{ currentTab, setCurrentTab }}>
			{children}
		</TabContext.Provider>
	);
};

// Custom hook for easier usage of the TabContext
export const useTab = () => useContext(TabContext);
