import React from 'react';
import GymSelection from './GymSelection';
import { ELITE_DATA } from '../data/eliteData';

const EliteSelection = (props) => (
  <GymSelection
    {...props}
    nodes={ELITE_DATA}
    progressKey="eliteProgress"
    modeLabels={{
      role: 'Miembro del Alto Mando',
      action: 'INICIAR DESAFÍO',
      completed: 'RIVAL VENCIDO',
    }}
  />
);

export default EliteSelection;
