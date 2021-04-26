import { FetchApiService } from "../api";

afterAll(() => jest.clearAllMocks());

describe("api service", () => {
  it("should call fetch with the url prefix and treat the response as json", async () => {
    let url: RequestInfo = "";
    let options: RequestInit = {};

    const mockFetch = jest.fn();
    const toJson = jest.fn();

    toJson.mockImplementation(async () => ({}));

    mockFetch.mockImplementationOnce((_url, _options) => {
      url = _url;
      options = _options ?? options;
      return Promise.resolve({
        status: 200,
        headers: {},
        json: toJson as () => Promise<unknown>,
      } as globalThis.Response);
    });

    const api = new FetchApiService(mockFetch, "/prefix");

    await api.request({ method: "GET", url: "/url" });

    expect(url).toBe("/prefix/url");
    expect(options?.method).toBe("GET");
    expect(toJson).toHaveBeenCalled();
  });
});
