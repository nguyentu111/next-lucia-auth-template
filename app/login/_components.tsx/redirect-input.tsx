import { RedirectSearchKey } from "@/contants";
import { useSearchParams } from "next/navigation";

export const RedirectInput = () => {
  const searchParams = useSearchParams();
  const redirect = searchParams.get(RedirectSearchKey) || "";
  return <input type="hidden" name={RedirectSearchKey} value={redirect} />;
};
