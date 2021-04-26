import React from "react";
import { CharityCard } from "./components/card";
import { useRemote } from "./hooks/remote";
import charitySvc, { CharityService } from "./services/charities";
import donationSvc, { Donation, DonationService, NewDonation } from "./services/donations";
import * as RemoteData from "./utils/remotedata";

export const makeApp = (charitySvc: CharityService, donationSvc: DonationService) => (): JSX.Element => {
  const [remoteCharities, loadCharities] = useRemote(() => charitySvc.loadCharities());

  const [remoteDonations, loadDonations] = useRemote(() => donationSvc.loadDonations());

  const handleDonation = React.useCallback(
    async (newDonation: NewDonation) => {
      const donation = await donationSvc.createDonation(newDonation);
      loadDonations();
      return donation;
    },
    [loadDonations]
  );

  React.useEffect(() => {
    loadCharities();
    loadDonations();
  }, [loadCharities, loadDonations]);

  const remoteCombined = React.useMemo(
    () =>
      RemoteData.apply(
        RemoteData.map(remoteCharities, (charities) => (donations: Donation[]) => ({ charities, donations })),
        remoteDonations
      ),
    [remoteCharities, remoteDonations]
  );
  const totalDonations = useDonationsTotal(remoteDonations);

  return (
    <div className="flex items-center flex-col">
      <div className="container">
        <h1 className="my-10 text-center text-4xl text-gray-500 font-bold">Omise Tamboon React</h1>
      </div>
      <div className="container">
        {RemoteData.matchSome(
          remoteCombined, // use the combined values here because rendering depends on the donations total
          {
            Success: ({ charities }) => (
              <>
                <p className="text-center text-lg">
                  All donations: <span className="text-green-700">{totalDonations}</span>
                </p>
                <div className="grid m-8 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-10">
                  {charities.map((charity) => (
                    <CharityCard key={charity.id} charity={charity} onDonate={handleDonation} />
                  ))}
                </div>
              </>
            ),
            // [TODO] Add error handling if this is a production app
          },
          () => (
            <></> // this was a spinner during development, but without a more complex animated transition it lowered the quality of the UX
          )
        )}
      </div>
    </div>
  );
};

const useDonationsTotal = (remoteDonations: RemoteData.RemoteData<Donation[], unknown>): string =>
  React.useMemo(() => {
    const donations = RemoteData.withDefault(remoteDonations, []);
    const total = donations.reduce((total, donation) => total + donation.amount, 0);
    const formatter = new Intl.NumberFormat(navigator.language, {
      style: "currency",
      currency: "THB", // [TODO] maybe need to handle donations in multiple currencies
    });
    return formatter.format(total);
  }, [remoteDonations]);

export default makeApp(charitySvc, donationSvc);
