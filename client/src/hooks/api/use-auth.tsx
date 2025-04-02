import { getCurrentUserQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
// import Cookies from "js-cookie"
const useAuth = () => {
  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUserQueryFn,
    staleTime: 0,
    retry: 2,
    // enabled: !!Cookies.get("connect.sid")
  });
  return query;
};

export default useAuth;
