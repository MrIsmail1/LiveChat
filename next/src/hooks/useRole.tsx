import { getUser } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function useRole({ roles }: { roles: string[] }) {
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getUser,
  });

  return currentUser?.role?.value
    ? roles.includes(currentUser.role.value)
    : false;
}
