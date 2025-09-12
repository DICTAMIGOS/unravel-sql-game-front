import { useState, useCallback } from 'react';

export interface ModalConfig {
  title?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  fullWidth?: boolean;
  fullScreen?: boolean;
  disableBackdropClick?: boolean;
  disableEscapeKeyDown?: boolean;
  showCloseButton?: boolean;
  persistent?: boolean;
  className?: string;
}

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);
  const [config, setConfig] = useState<ModalConfig>({});

  const openModal = useCallback((
    modalContent: React.ReactNode, 
    modalConfig: ModalConfig = {}
  ) => {
    setContent(modalContent);
    setConfig({
      maxWidth: 'md',
      fullWidth: true,
      showCloseButton: true,
      ...modalConfig
    });
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    if (config.persistent) return;
    
    setIsOpen(false);
    // Limpiar contenido después del cierre para evitar flashes
    setTimeout(() => {
      setContent(null);
      setConfig({});
    }, 300);
  }, [config.persistent]);

  const forceCloseModal = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setContent(null);
      setConfig({});
    }, 300);
  }, []);

  return {
    isOpen,
    content,
    config,
    openModal,
    closeModal,
    forceCloseModal,
  };
};