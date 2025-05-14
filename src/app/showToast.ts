import { Toast } from "@radix-ui/react-toast";
export function ShowNotification(toast : 
  {
    id: string;
    dismiss: () => void;
    update: (props: ToasterToast) => void;
  }
) {
  const notifySaved = () => {
    toast({
      title: "Changes are saved!",
      description: "You can continue editing now :D",
      variant: "success",
    });
  };
}
