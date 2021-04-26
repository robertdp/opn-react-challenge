import React from "react";
import { Failure, Loading, NotAsked, RemoteData, Success } from "../utils/remotedata";

export const useRemote = <Response, Params extends never[]>(
  runRequest: (...params: Params) => Promise<Response>
): [RemoteData<Response, Error>, (...params: Params) => Promise<void>] => {
  const count = React.useRef(0);
  const [result, setResult] = React.useState<RemoteData<Response, Error>>(NotAsked);

  const fetchRemote = React.useCallback(
    (...params: Params) => {
      const id = ++count.current; // track the requests

      if (id === 1) {
        // only trigger a rerender on loading for the first request
        setResult(Loading);
      }

      return runRequest(...params)
        .then((response) => {
          // keep only the most recent
          if (count.current === id) {
            setResult(Success(response));
          }
        })
        .catch((err) => {
          // keep only the most recent
          if (count.current === id) {
            setResult(Failure(err));
          }
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setResult]
  );

  return [result, fetchRemote];
};
