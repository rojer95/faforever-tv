import React from 'react';

import PlayerStore from '../mobx/player';

export const PlayerStoresContext = React.createContext(PlayerStore);

export const usePlayer = () => React.useContext(PlayerStoresContext);
