import Head from "next/head";
import React, { FunctionComponent, ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { PhaseBanner } from "./PhaseBanner";

interface LayoutProps {
  children: ReactNode;
  head?: ReactNode;
  navigation?: ReactNode;
  title: string;
  pageHasErrors: boolean;
}

interface BeaconRegistrationHeadProps {
  title: string;
  pageHasErrors: boolean;
}

export const Layout: FunctionComponent<LayoutProps> = ({
  children,
  title,
  pageHasErrors,
  head = <BeaconRegistrationHead title={title} pageHasErrors={pageHasErrors} />,
  navigation = null,
}: LayoutProps): JSX.Element => (
  <>
    {head}
    <a href="#main-content" className="govuk-skip-link" role="main">
      Skip to main content
    </a>
    <Header
      serviceName={"Maritime and Coastguard Agency: Register a beacon"}
      homeLink={"/"}
    />
    <PhaseBanner phase="BETA">
      This is a new service – your{" "}
      <a className="govuk-link" href="#">
        feedback
      </a>{" "}
      will help us to improve it.
    </PhaseBanner>

    <div className="govuk-width-container">
      {navigation}

      <main id="main-content" className="govuk-main-wrapper">
        {children}
      </main>
    </div>

    <Footer />
  </>
);

export const BeaconRegistrationHead: FunctionComponent<BeaconRegistrationHeadProps> = ({
  title,
  pageHasErrors,
}: BeaconRegistrationHeadProps) => {
  const headTitle = pageHasErrors ? `Error: ${title}` : title;

  return (
    <Head>
      <title>{`${headTitle} - Beacon Registration Service - GOV.UK`}</title>
    </Head>
  );
};
