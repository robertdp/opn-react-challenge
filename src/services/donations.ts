import { isSuccess } from "../utils/request";
import api, { ApiService } from "./api";

export type Donation = {
  id?: number;
  charitiesId: number;
  amount: number;
  currency: "THB"; // [TODO] Replace with proper currency model in the future
};

export type NewDonation = Omit<Donation, "id">;

export const DONATION_AMOUNTS = [10, 20, 50, 100, 500]; // this is naive, and doesn't consider currencies

export interface DonationService {
  loadDonations(): Promise<Donation[]>;
  createDonation(donation: NewDonation): Promise<Donation>;
}

export class ApiDonationService implements DonationService {
  constructor(protected api: ApiService) {}

  async loadDonations(): Promise<Donation[]> {
    const response = await this.api.request<never, Donation[]>({ method: "GET", url: "/payments" });
    if (!isSuccess(response)) throw response;
    return response.body;
  }

  async createDonation(donation: NewDonation): Promise<Donation> {
    const response = await this.api.request<unknown, Donation>({ method: "POST", url: "/payments", body: donation });
    if (!isSuccess(response)) throw response;
    return response.body;
  }
}

export default new ApiDonationService(api);
