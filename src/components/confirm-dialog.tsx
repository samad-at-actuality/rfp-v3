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
}: {
  open: boolean;
  onOpenChange: (_: boolean) => void;
  isLoading?: boolean;
  handleConfirmClose: () => void;
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Close Chat?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to close the chat? Your conversation history
            will be cleared.
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
              label='Proceed'
              isLoading={!!isLoading}
            />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
