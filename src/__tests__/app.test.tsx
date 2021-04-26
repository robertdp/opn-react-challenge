import { makeApp } from "../app";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import React from "react";
import { Charity } from "../services/charities";
import { Donation, NewDonation } from "../services/donations";

const charities = {
  loadCharities: jest.fn().mockReturnValue(Promise.resolve([])),
};

const donations = {
  loadDonations: jest.fn().mockReturnValue(Promise.resolve([])),
  createDonation: jest.fn().mockImplementation(() => {
    throw { status: 500, headers: {} };
  }),
};

const App = makeApp(charities, donations);

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

describe("app component", () => {
  it("load the charities and donations on mount", async () => {
    charities.loadCharities.mockReturnValueOnce(
      Promise.resolve<Charity[]>([{ id: 1, name: "Test Charity", currency: "THB", image: "" }])
    );

    await act(async () => {
      const dom = render(<App />);
      await waitFor(() => dom.findByText("Test Charity"));
    });

    expect(charities.loadCharities).toHaveBeenCalledTimes(1);
    expect(donations.loadDonations).toHaveBeenCalledTimes(1);
  });

  it("shows the correct donation total", async () => {
    donations.loadDonations.mockReturnValueOnce(
      Promise.resolve<Donation[]>([100, 200, 300, 400].map((amount) => ({ charitiesId: 1, currency: "THB", amount })))
    );

    await act(async () => {
      const dom = render(<App />);
      const donations = await waitFor(() => dom.findByText("All donations:"));
      expect(donations.querySelector("span")?.textContent).toBe("THB 1,000.00");
    });
  });

  it("successfully sends a new donation", async () => {
    charities.loadCharities.mockReturnValueOnce(
      Promise.resolve<Charity[]>([{ id: 1, name: "Test Charity", currency: "THB", image: "" }])
    );

    donations.createDonation.mockImplementationOnce((donation: NewDonation) => {
      expect(donation.amount).toBe(100);
      return Promise.resolve<Donation>({ ...donation, id: 99 });
    });

    await act(async () => {
      const dom = render(<App />);
      const donateButton = await waitFor(() => dom.findByText("Donate"));
      fireEvent.click(donateButton);
      const donate100 = await waitFor(() => dom.findByText("100"));
      fireEvent.click(donate100);
      const sendDonationButton = await waitFor(() => dom.findByText("Pay"));
      expect(donations.loadDonations).toHaveBeenCalledTimes(1);
      fireEvent.click(sendDonationButton);
      await waitFor(() => dom.findByText("Thank you for donating!"));
      expect(donations.loadDonations).toHaveBeenCalledTimes(2);
    });

    expect(donations.createDonation).toHaveBeenCalledTimes(1);
  });
});
