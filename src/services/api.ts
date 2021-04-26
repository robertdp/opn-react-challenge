import _fetch from "isomorphic-fetch";
import { API_PATH } from "../env";
import { Fetch, makeJsonRequest, RequestSpec, Response, withBaseUrl } from "../utils/request";

export interface ApiService {
  request<RequestBody, ResponseBody>(spec: RequestSpec<RequestBody>): Promise<Response<ResponseBody>>;
}

export class FetchApiService implements ApiService {
  constructor(protected fetch: Fetch, protected baseUrl: string = "") {}

  request<RequestBody, ResponseBody>(spec: RequestSpec<RequestBody>): Promise<Response<ResponseBody>> {
    let request = makeJsonRequest<RequestBody, ResponseBody>(spec);
    request = withBaseUrl(this.baseUrl)(request);
    return request(this.fetch);
  }
}

export class UnexpectedResponseError extends Error {
  name = "UnexpectedResponseError";
  constructor(public response: Response<never>) {
    super(`Unexpected response: ${response.status}`);
  }
}

export default new FetchApiService(_fetch, API_PATH);
