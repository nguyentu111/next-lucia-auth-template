import Link from "next/link";
import { useSearchParams } from "next/navigation";

export const SignUpLink = () => {
  const searchParams = useSearchParams();

  return (
    <Link
      className="text-blue-500 underline"
      href={{
        pathname: "/join",
        search: searchParams.toString(),
      }}
    >
      Sign up
    </Link>
  );
};
