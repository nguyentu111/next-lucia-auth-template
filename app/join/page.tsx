"use client";
import { signup } from "@/actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useRef, useState } from "react";
import { LoginLink } from "./_components/login-link";
import { RedirectInput } from "./_components/redirect-input";

export default function Join() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  //   useEffect(() => {
  //     if (actionData?.errors?.email) {
  //       emailRef.current?.focus();
  //     } else if (actionData?.errors?.password) {
  //       passwordRef.current?.focus();
  //     }
  //   }, [actionData]);
  const [error, setError] = useState<
    null | Awaited<ReturnType<typeof signup>>["error"]
  >();
  const handleSignup = async (data: FormData) => {
    const rs = await signup(data);
    rs.error && setError(rs.error);
  };

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <form className="space-y-6" action={handleSignup}>
          <div>
            <label
              htmlFor="username"
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
                // aria-invalid={actionData?.errors?.email ? true : undefined}
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
                autoComplete="new-password"
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

          <Suspense>
            <RedirectInput />
          </Suspense>
          <button
            type="submit"
            className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Create Account
          </button>
          <div className="flex items-center justify-center">
            <div className="text-center text-sm text-gray-500">
              Already have an account?
              <Suspense>
                <LoginLink />
              </Suspense>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
