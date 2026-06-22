import React, { createContext, useContext, useEffect, useState } from 'react';

const CountryContext = createContext();

export const CountryProvider = ({ children }) => {
  const [country, setCountry] = useState('in');

  useEffect(() => {
    const stored = window.localStorage.getItem('infopulse-country');
    if (stored === 'in' || stored === 'us') {
      setCountry(stored);
    }
  }, []);

  const changeCountry = (newCountry) => {
    if (newCountry === 'in' || newCountry === 'us') {
      setCountry(newCountry);
      window.localStorage.setItem('infopulse-country', newCountry);
    }
  };

  return (
    <CountryContext.Provider value={{ country, setCountry: changeCountry }}>
      {children}
    </CountryContext.Provider>
  );
};

export const useCountry = () => useContext(CountryContext);
