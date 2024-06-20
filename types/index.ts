export interface ActionResult<T> {
  error: T;
}
export type UserWithoutPass = Omit<
  {
    id: string;
    username: string;
    password_hash: string;
  },
  "password_hash"
>;
