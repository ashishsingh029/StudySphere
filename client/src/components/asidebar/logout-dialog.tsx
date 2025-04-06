import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { logoutMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { useStore } from "@/store/store";

const LogoutDialog = (props: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { isOpen, setIsOpen } = props;
  const [ isPending, setIsPending ] = useState<boolean>(false);
  const navigate = useNavigate();
  const { clearAccessToken } = useStore();

  // const { mutate, isPending } = useMutation({
  //   mutationFn: logoutMutationFn,
  //   onSuccess: () => {
  //     queryClient.resetQueries({
  //       queryKey: ["authUser"],
  //     });
  //     clearAccessToken();
  //     navigate("/");
  //     setIsOpen(false);
  //   },
  //   onError: (error) => {
  //     toast({
  //       title: "Error",
  //       description: error.message,
  //       variant: "destructive",
  //     });
  //   },
  // });

  // Handle logout action
  // const handleLogout = useCallback(() => {
  //   if (isPending) return;
  //   mutate();
  // }, [isPending, mutate]);

  const handleLogout = async () => {
    setIsPending(true);
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Wait for 1.5 seconds
    try {
      logoutMutationFn();
      clearAccessToken();
      navigate("/");
      toast({
        title: "Success",
        description: "Logout Successful",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to Logout",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

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
