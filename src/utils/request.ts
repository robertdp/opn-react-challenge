// a basic approach to extendable request builders

// Types
export type RequestSpec<RequestBody> = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  query?: QueryParams;
  headers?: Record<string, string>;
  body?: RequestBody;
};

export type QueryParams = Record<string, string | number | boolean | undefined>;

export type Response<ResponseBody> = {
  status: number;
  headers: Headers;
  body: ResponseBody;
};

export type Fetch = typeof globalThis.fetch;

export type Request<ResponseBody> = (fetch: Fetch) => Promise<Response<ResponseBody>>;

// Builders
export const makeJsonRequest = <RequestBody, ResponseBody>(
  request: RequestSpec<RequestBody>
): Request<ResponseBody> => {
  return (fetch) =>
    fetch(request.url + toQueryString({ ...request.query }), {
      method: request.method,
      headers: {
        ...request.headers,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request.body),
    }).then<Response<ResponseBody>>((response) =>
      response.json().then(
        (json) =>
          ({
            status: response.status,
            headers: response.headers,
            body: json, // unsafe cast
          } as Response<ResponseBody>)
      )
    );
};

// Transformers
export const withBaseUrl = (baseUrl: string) => <ResponseBody>(
  request: Request<ResponseBody>
): Request<ResponseBody> => (fetch) => request((url, config) => fetch(baseUrl + url, config));

// Helpers

const toQueryString = (params: QueryParams): string => {
  const q = Object.keys(params)
    .sort()
    .map((key) => {
      const value = params[key];
      if (value === undefined) {
        return encodeURIComponent(key);
      } else {
        return encodeURIComponent(key) + "=" + encodeURIComponent(value);
      }
    });

  if (q.length > 0) {
    return "?" + q.join("&");
  } else {
    return "";
  }
};

export const isSuccess = <T>(response: Response<T>): boolean => {
  return response.status >= 200 && response.status <= 299;
};

export const launch = <ResponseBody>(request: Request<ResponseBody>): Promise<Response<ResponseBody>> => request(fetch);
