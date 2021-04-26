import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export const Spinner = (): JSX.Element => <FontAwesomeIcon icon={faCircleNotch} className="fa-spin" />;
