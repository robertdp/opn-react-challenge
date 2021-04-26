import { isSuccess } from "../utils/request";
import api, { ApiService } from "./api";

export type Charity = {
  id: number;
  name: string;
  image: string;
  currency: "THB"; // [TODO] Replace with proper currency model in the future
};

export interface CharityService {
  loadCharities(): Promise<Charity[]>;
}

export class ApiCharityService implements CharityService {
  constructor(protected api: ApiService) {}

  async loadCharities(): Promise<Charity[]> {
    const response = await this.api.request<never, Charity[]>({ method: "GET", url: "/charities" });
    if (!isSuccess(response)) throw response;
    return response.body;
  }
}

export default new ApiCharityService(api);
