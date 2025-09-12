import React from 'react';
import { useModalContext } from '../hooks/useModalContext';

// Ejemplo de componente que usa el modal
export const ExampleModalUsage: React.FC = () => {
  const { openModal, closeModal } = useModalContext();

  const handleOpenConfirmModal = () => {
    openModal(
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          ¿Estás seguro?
        </h3>
        <p className="text-gray-300 mb-6">
          Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              console.log('Acción confirmada');
              closeModal();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>,
      {
        title: 'Confirmación',
        maxWidth: 'sm',
        disableBackdropClick: true,
      }
    );
  };

  const handleOpenInfoModal = () => {
    openModal(
      <div>
        <p className="text-gray-300 mb-4">
          Este es un modal informativo con contenido personalizado.
        </p>
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
          <h4 className="text-blue-300 font-semibold mb-2">Información importante</h4>
          <p className="text-blue-200 text-sm">
            Puedes personalizar completamente el contenido de los modales.
          </p>
        </div>
      </div>,
      {
        title: 'Información',
        maxWidth: 'lg',
        showCloseButton: true,
      }
    );
  };

  const handleOpenFullScreenModal = () => {
    openModal(
      <div className="h-full flex flex-col">
        <div className="flex-1 p-8">
          <h3 className="text-2xl font-bold text-gray-100 mb-6">Modal en Pantalla Completa</h3>
          <p className="text-gray-300 mb-4">
            Este modal ocupa toda la pantalla. Perfecto para formularios largos o contenido extenso.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-gray-100 font-semibold mb-2">Sección 1</h4>
              <p className="text-gray-400">Contenido de ejemplo...</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-gray-100 font-semibold mb-2">Sección 2</h4>
              <p className="text-gray-400">Más contenido de ejemplo...</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 p-4 flex justify-end">
          <button
            onClick={closeModal}
            className="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>,
      {
        title: 'Modal Completo',
        fullScreen: true,
        showCloseButton: true,
      }
    );
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-bold text-gray-100 mb-4">Ejemplos de Modal</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={handleOpenConfirmModal}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Modal de Confirmación
        </button>
        
        <button
          onClick={handleOpenInfoModal}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Modal Informativo
        </button>
        
        <button
          onClick={handleOpenFullScreenModal}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Modal Pantalla Completa
        </button>
      </div>
    </div>
  );
};
