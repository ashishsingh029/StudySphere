import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCallback} from "react";
import { logoutMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { useStore } from "@/store/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const LogoutDialog = (props: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { isOpen, setIsOpen } = props;
  // const [ isPending, setIsPending ] = useState<boolean>(false);
  const { clearAccessToken } = useStore();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: logoutMutationFn,
    onSuccess: () => {
      queryClient.resetQueries({
        queryKey: ["authUser"],
        
      });
      toast({
        title: "Success",
        description: "Logout Successful",
        variant: "success",
      });
      clearAccessToken();
      // navigate("/");
      setIsOpen(false);
    },
    onError: (error:any) => {
      toast({
        title: "Error",
        description: error.response.data.message,
        variant: "destructive",
      });
    },
  });

  // Handle logout action
  const handleLogout = useCallback(() => {
    if (isPending) return;
    mutate();
  }, [isPending, mutate]);

  // const handleLogout = async () => {
  //   setIsPending(true);
  //   try {
  //     logoutMutationFn();
  //     clearAccessToken();
  //     toast({
  //       title: "Success",
  //       description: "Logout Successful",
  //       variant: "success",
  //     });
  //     // navigate("/")
  //     await new Promise((resolve) => setTimeout(resolve, 1500)); // Wait for 1.5 seconds
  //     window.location.href = '/';
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Unable to Logout",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsPending(false);
  //   }
  // };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to log out?</DialogTitle>
            <DialogDescription>
              This will end your current session and you will need to log in
              again to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button disabled={isPending} type="button" onClick={handleLogout}>
              {isPending && <Loader className="animate-spin" />}
              Sign out
            </Button>
            <Button type="button" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LogoutDialog;
