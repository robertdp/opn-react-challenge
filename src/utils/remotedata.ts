// a TypeScript version of RemoteData, based on https://github.com/krisajenkins/purescript-remotedata

// Type definitions
type NotAsked = { tag: "NotAsked" };
type Loading = { tag: "Loading" };
type Success<A> = { tag: "Success"; value: A };
type Failure<E> = { tag: "Failure"; value: E };

export type RemoteData<A, E> = NotAsked | Loading | Success<A> | Failure<E>;

// Data constructors
export const NotAsked: RemoteData<never, never> = { tag: "NotAsked" };
export const Loading: RemoteData<never, never> = { tag: "Loading" };
export const Success = <A>(value: A): RemoteData<A, never> => ({ tag: "Success", value });
export const Failure = <E>(value: E): RemoteData<never, E> => ({ tag: "Failure", value });

// Matching functions
export const isNotAsked = <A, E>(value: RemoteData<A, E>): value is NotAsked => value.tag === "NotAsked";
export const isLoading = <A, E>(value: RemoteData<A, E>): value is Loading => value.tag === "Loading";
export const isSuccess = <A, E>(value: RemoteData<A, E>): value is Success<A> => value.tag === "Success";
export const isFailure = <A, E>(value: RemoteData<A, E>): value is Failure<E> => value.tag === "Failure";

export const withDefault = <A, E>(value: RemoteData<A, E>, fallback: A): A => {
  if (isSuccess(value)) return value.value;
  return fallback;
};

export const matchSome = <A, E, B>(
  value: RemoteData<A, E>,
  matcher: {
    NotAsked?: () => B;
    Loading?: () => B;
    Success?: (value: A) => B;
    Failure?: (value: E) => B;
  },
  fallback: () => B
): B => matchAll(value, { NotAsked: fallback, Loading: fallback, Success: fallback, Failure: fallback, ...matcher });

export const matchAll = <A, E, B>(
  value: RemoteData<A, E>,
  matcher: {
    NotAsked: () => B;
    Loading: () => B;
    Success: (value: A) => B;
    Failure: (value: E) => B;
  }
): B => {
  if (isSuccess(value)) return matcher.Success(value.value);
  else if (isFailure(value)) return matcher.Failure(value.value);
  else if (isNotAsked(value)) return matcher.NotAsked();
  else return matcher.Loading();
};

// Functor map
export const map = <A, E, B>(value: RemoteData<A, E>, f: (value: A) => B): RemoteData<B, E> => {
  if (isSuccess(value)) {
    return Success(f(value.value));
  }
  return value;
};

// Bifunctor lmap
export const mapError = <A, E, F>(value: RemoteData<A, E>, f: (value: E) => F): RemoteData<A, F> => {
  if (isFailure(value)) {
    return Failure(f(value.value));
  }
  return value;
};

// Applicative apply
export const apply = <A, E, B>(first: RemoteData<(value: A) => B, E>, second: RemoteData<A, E>): RemoteData<B, E> => {
  if (isSuccess(first) && isSuccess(second)) return Success(first.value(second.value));
  else if (isFailure(first)) return first;
  else if (isFailure(second)) return second;
  else if (isNotAsked(first) || isNotAsked(second)) return NotAsked;
  else return Loading;
};

export const successes = <A, E>(xs: Array<RemoteData<A, E>>): Array<A> => xs.filter(isSuccess).map((x) => x.value);

export const failures = <A, E>(xs: Array<RemoteData<A, E>>): Array<E> => xs.filter(isFailure).map((x) => x.value);
