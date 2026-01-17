import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    // Load saved city from localStorage
    const savedCity = localStorage.getItem("selectedCity");
    if (savedCity) {
      setSelectedCity(savedCity);
    }
    setAppLoading(false);
  }, []);

  const updateCity = (city) => {
    localStorage.setItem("selectedCity", city);
    setSelectedCity(city);
  };

  if (appLoading) {
    return <div>Loading app preferences...</div>;
  }

  return (
    <AppContext.Provider
      value={{
        selectedCity,
        setSelectedCity: updateCity,
        appLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
