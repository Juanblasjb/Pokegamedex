import React from 'react';
import GymSelection from './GymSelection';
import { ROCKET_DATA } from '../data/rocketData';

const RocketSelection = (props) => (
  <GymSelection
    {...props}
    nodes={ROCKET_DATA}
    progressKey="rocketProgress"
    modeLabels={{ role: 'Operación Team Rocket', action: 'INFILTRARSE', completed: 'OPERACIÓN SUPERADA' }}
  />
);

export default RocketSelection;
