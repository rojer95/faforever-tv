import React from 'react';

import PlayerStore from '../mobx/player';
import LikeStore from '../mobx/like';

export const PlayerStoresContext = React.createContext(PlayerStore);
export const LikeStoresContext = React.createContext(LikeStore);

export const usePlayer = () => React.useContext(PlayerStoresContext);
export const useLike = () => React.useContext(LikeStoresContext);
