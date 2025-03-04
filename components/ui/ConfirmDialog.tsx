import React from 'react';
import Popin from './Popin';
import { Button } from './Button';
import Loader from './Loader';

type ConfirmProps = {
  isOpen: boolean;
  text: string;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  error?: string;
  isLoading?: boolean;
  loadingMessage?: string;
};

const ConfirmationDialog: React.FC<ConfirmProps> = ({ isOpen, text, title, onCancel, onConfirm, error, isLoading, loadingMessage }) => {

  return (
    <Popin isOpen={isOpen} onClose={onCancel} title={title}>
      <p>{text}</p>
      <div className="mt-4 flex justify-end space-x-2">
        <Button btnType='secondary' onClick={onConfirm}>Confirm</Button>
        <Button btnType='primary' onClick={onCancel}>Cancel</Button>
      </div>
      <Loader isLoading={isLoading ?? false} text={loadingMessage ?? 'Deleting...'} ></Loader>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </Popin>
  );
};

export default ConfirmationDialog;
