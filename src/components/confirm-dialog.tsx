import { LoadingButton } from './loading-button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

export const ConfirmDialog = ({
  open,
  onOpenChange,
  isLoading,
  handleConfirmClose,
  title,
  description,
  btnLabel,
}: {
  open: boolean;
  onOpenChange: (_: boolean) => void;
  isLoading?: boolean;
  handleConfirmClose: () => void;
  title?: string;
  description?: string;
  btnLabel?: string;
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title || 'Close Chat?'}</AlertDialogTitle>
          <AlertDialogDescription>
            {description ||
              'Are you sure you want to close the chat? Your conversation history will be cleared.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              onOpenChange(false);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <LoadingButton
              onClick={handleConfirmClose}
              label={btnLabel || 'Proceed'}
              isLoading={!!isLoading}
            />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
