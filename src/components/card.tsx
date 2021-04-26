import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { IMAGES_PATH } from "../env";
import { Charity } from "../services/charities";
import { Donation, DONATION_AMOUNTS, NewDonation } from "../services/donations";
import { ActionButton } from "./button";

type CharityCardProps = {
  charity: Charity;
  onDonate: (donation: NewDonation) => Promise<Donation>;
};

export const CharityCard = ({ charity, onDonate }: CharityCardProps): JSX.Element => {
  const [overlay, setOverlay] = React.useState<"none" | "donate" | "thanks">("none");
  const [amount, setAmount] = React.useState<number>(0);

  return (
    <div className="relative flex flex-col w-full h-full bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
      <img src={IMAGES_PATH + "/" + charity.image} className="h-64 object-cover select-none pointer-events-none" />
      <div className="flex flex-row">
        <div className="m-6 flex-grow text-xl font-semibold text-gray-500">{charity.name}</div>
        <div className="mr-6 flex items-center">
          <ActionButton onClick={() => setOverlay("donate")}>Donate</ActionButton>
        </div>
      </div>
      {overlay !== "none" ? (
        <div className="absolute flex flex-col inset-0 bg-white opacity-95 justify-center items-center select-none text-lg">
          {overlay === "donate" ? (
            <>
              <div className="flex absolute top-0 right-0 w-8 h-8 justify-center items-center text-xl">
                {/* close button */}
                <button onClick={() => setOverlay("none")}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <p>Select the amount to donate ({charity.currency}):</p>
              <ul className="flex flex-row mb-4">
                {DONATION_AMOUNTS.map((donationAmount) => (
                  <li key={donationAmount} className="flex">
                    <label className="p-3">
                      <input
                        type="radio"
                        className="mr-2"
                        checked={amount === donationAmount}
                        onChange={(ev) => {
                          if (ev.target.checked) {
                            setAmount(donationAmount);
                          }
                        }}
                      />
                      {donationAmount}
                    </label>
                  </li>
                ))}
              </ul>
              <ActionButton
                onClick={async () => {
                  await onDonate({ charitiesId: charity.id, amount, currency: charity.currency });
                  setOverlay("thanks");
                  setAmount(0);
                }}
                disabled={amount == 0}
              >
                Send Donation
              </ActionButton>
            </>
          ) : null}
          {overlay === "thanks" ? (
            <>
              <p className="text-blue-700 mb-4 font-semibold">Thank you for donating!</p>
              <ActionButton onClick={() => setOverlay("none")}>Close</ActionButton>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
