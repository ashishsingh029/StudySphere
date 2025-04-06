import { getCurrentUserQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
// import Cookies from "js-cookie"
const useAuth = () => {
  // const { accessToken }  = useStore()
  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUserQueryFn,
    staleTime: 0,
    retry: 2,
    // enabled: !!accessToken,
  });
  return query;
};

export default useAuth;
