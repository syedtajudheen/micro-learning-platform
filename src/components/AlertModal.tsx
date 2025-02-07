import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type AlertModalProps = {
  variant: 'delete' | 'confirm';
  title: string;
  description: string;
  confirmText: string;
  onConfirm: () => void;
};

export function AlertModal({
  variant,
  title,
  description,
  confirmText,
  onConfirm
}: AlertModalProps) {
  const className = (variant === 'delete') ? "bg-red-700 hover:bg-red-600" : "";

  return (
    <AlertDialogContent className="bg-white">
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>
          {description}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction className={className} onClick={onConfirm}>{confirmText}</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
};
