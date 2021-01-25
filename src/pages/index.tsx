import React, { FunctionComponent } from "react";
import { PhaseBanner } from "../components/PhaseBanner";
import { Header } from "../components/Header";

const Home: FunctionComponent = () => {
  return (
    <>
      <Header serviceName={"Beacons Beacons Beacons"} homeLink={"#"} />
      <PhaseBanner
        phase={"BETA"}
        bannerHtml={
          <div>
            This is a new service – your{" "}
            <a className="govuk-link" href="#">
              feedback
            </a>{" "}
            will help us to improve it.
          </div>
        }
      />
    </>
  );
};

export default Home;
