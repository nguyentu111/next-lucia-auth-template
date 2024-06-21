import Link from "next/link";
import { useSearchParams } from "next/navigation";

export const LoginLink = () => {
  const searchParams = useSearchParams();

  return (
    <Link
      className="text-blue-500 underline"
      href={{
        pathname: "/login",
        search: searchParams.toString(),
      }}
    >
      Log in
    </Link>
  );
};
