import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';

export const LoadingButton = ({
  label,
  isLoading,
  loaderIcon,
  className,
  variant = 'default',
  size = 'default',
  onClick,
}: {
  label: string;
  isLoading: boolean;
  loaderIcon?: React.ReactNode;
  className?: string;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  onClick?: (_: any) => void;
}) => {
  return (
    <Button
      size={size}
      variant={variant}
      disabled={isLoading}
      className={`${className}`}
      onClick={onClick}
    >
      {isLoading ? (
        loaderIcon ? (
          loaderIcon
        ) : (
          <Loader2 className='h-4 w-4 animate-spin' />
        )
      ) : (
        label
      )}
    </Button>
  );
};
