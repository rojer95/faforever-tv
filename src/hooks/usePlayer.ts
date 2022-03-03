import React from 'react';
import PlayerContext from '../contexts/player';

export const usePlayer = () => {
  return React.useContext(PlayerContext);
};
