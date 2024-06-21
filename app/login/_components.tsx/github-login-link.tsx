import { RedirectSearchKey } from "@/contants";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export const GithubLoginLink = () => {
  const searchParams = useSearchParams();
  const redirect = searchParams.get(RedirectSearchKey) || "";

  return (
    <Link
      href={`/api/login/github${redirect ? `?redirect=${redirect}` : ""}`}
      className="block text-center hover:bg-gray-200 transition-all w-full rounded border border-gray-500 px-2 py-1 text-lg"
    >
      Login with github{" "}
    </Link>
  );
};
