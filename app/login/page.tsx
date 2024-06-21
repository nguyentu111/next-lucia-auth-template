"use client";
import { login } from "@/actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "";
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<
    null | Awaited<ReturnType<typeof login>>["error"]
  >();
  const handleLogin = async (data: FormData) => {
    const rs = await login(data);
    rs.error && setError(rs.error);
  };

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <form className="space-y-6" action={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                ref={emailRef}
                id="username"
                required
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus={true}
                name="username"
                autoComplete="username"
                // aria-invalid={actionData?.errors?.username ? true : undefined}
                aria-describedby="username-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {error?.username ? (
                <div className="pt-1 text-red-700" id="username-error">
                  {error.username}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                ref={passwordRef}
                name="password"
                type="password"
                autoComplete="current-password"
                // aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {error?.password ? (
                <div className="pt-1 text-red-700" id="password-error">
                  {error.password}
                </div>
              ) : null}
            </div>
          </div>

          <input type="hidden" name="redirect" value={redirect} />
          {error?.all ? (
            <div className="text-red-700" id="all-error">
              {error.all}
            </div>
          ) : null}
          <button
            type="submit"
            className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Log in
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                className="text-blue-500 underline"
                href={{
                  pathname: "/join",
                  search: searchParams.toString(),
                }}
              >
                Sign up
              </Link>
            </div>
          </div>
        </form>
        <div className="mt-4">
          <a
            href={`/api/login/github${redirect ? `?redirect=${redirect}` : ""}`}
            className="block text-center hover:bg-gray-200 transition-all w-full rounded border border-gray-500 px-2 py-1 text-lg"
          >
            Login with github{" "}
          </a>
        </div>
      </div>
    </div>
  );
}
