import { useContext } from 'react';
import { ModalContext } from '../contexts/ModalContext';

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext debe ser usado dentro de ModalProvider');
  }
  return context;
};
