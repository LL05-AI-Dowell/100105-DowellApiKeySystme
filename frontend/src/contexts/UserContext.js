const { createContext, useContext, useState } = require("react")

const UserContext = createContext({});

export const useUserContext = () => useContext(UserContext);


export const UserContextProvider = ({ children }) => {
    const [ currentUser, setCurrentUser ] = useState(null);
    const [ currentLocalSession, setCurrentLocalSession ] = useState(null);
    const [ appLoading, setAppLoading ] = useState(true);

    return <>
        <UserContext.Provider value={{ 
            currentUser,
            setCurrentUser,
            currentLocalSession,
            setCurrentLocalSession,
            appLoading,
            setAppLoading,
        }}>
            { children }
        </UserContext.Provider>
    </>
}