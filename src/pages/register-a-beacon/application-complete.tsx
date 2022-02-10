import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { ReturnToYourAccountSection } from "../../components/domain/ReturnToYourAccountSection";
import { Grid } from "../../components/Grid";
import { Layout } from "../../components/Layout";
import { BeaconRegistryContactInfo } from "../../components/Mca";
import { Panel } from "../../components/Panel";
import { GovUKBody } from "../../components/Typography";
import { DraftRegistration } from "../../entities/DraftRegistration";
import { verifyFormSubmissionCookieIsSet } from "../../lib/cookies";
import { clearFormSubmissionCookie } from "../../lib/middleware";
import { BeaconsGetServerSidePropsContext } from "../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../lib/middleware/withContainer";
import { withSession } from "../../lib/middleware/withSession";
import { redirectUserTo } from "../../lib/redirectUserTo";
import { formSubmissionCookieId } from "../../lib/types";
import { GeneralPageURLs } from "../../lib/urls";
import logger from "../../logger";
import { WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError } from "../../router/rules/WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError";

interface ApplicationCompleteProps {
  reference: string;
  registrationSuccess: boolean;
  confirmationEmailSuccess: boolean;
}

const ApplicationCompletePage: FunctionComponent<ApplicationCompleteProps> = ({
  reference,
  registrationSuccess,
  confirmationEmailSuccess,
}: ApplicationCompleteProps): JSX.Element => {
  const pageHeading = registrationSuccess
    ? "Beacon registration complete"
    : "Beacon registration failed";

  return (
    <>
      <Layout
        title={pageHeading}
        pageHasErrors={false}
        showCookieBanner={false}
      >
        <Grid
          mainContent={
            <>
              {registrationSuccess ? (
                <>
                  <ApplicationSuccessMessage
                    title={pageHeading}
                    confirmationEmailSuccess={confirmationEmailSuccess}
                    reference={reference}
                  />
                  <GovUKBody className="govuk-body">
                    Your application to register a UK 406 MHz beacon has been
                    received by the Maritime and Coastguard Beacon Registry
                    Team. You can now use your beacon.
                  </GovUKBody>
                </>
              ) : (
                <>
                  <ApplicationFailedMessage />
                  <BeaconRegistryContactInfo />
                </>
              )}
              <ReturnToYourAccountSection />
            </>
          }
        />
      </Layout>
    </>
  );
};

const ApplicationSuccessMessage = (props: {
  title: string;
  reference: string;
  confirmationEmailSuccess: boolean;
}): JSX.Element => (
  <Panel title={props.title} reference={props.reference}>
    {props.confirmationEmailSuccess
      ? "We have sent you a confirmation email."
      : "We could not send you a confirmation email but we have registered your beacon under the following reference id."}
  </Panel>
);

const ApplicationFailedMessage = () => (
  <div
    className="govuk-error-summary"
    aria-labelledby="error-summary-title"
    role="alert"
    data-module="govuk-error-summary"
  >
    <h2 className="govuk-error-summary__title" id="error-summary-title">
      There is a problem
    </h2>
    <div className="govuk-error-summary__body">
      <ul className="govuk-list govuk-error-summary__list">
        <li>
          {
            "We could not save your registration. Please contact the Beacons Registry team using the details below."
          }
        </li>
      </ul>
    </div>
  </div>
);

export const getServerSideProps: GetServerSideProps = withSession(
  withContainer(async (context: BeaconsGetServerSidePropsContext) => {
    const rule = new WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError(
      context
    );

    if (await rule.condition()) {
      return rule.action();
    }
    /* Retrieve injected use case(s) */
    const { getDraftRegistration, submitRegistration, getAccountHolderId } =
      context.container;

    /* Page logic */
    if (!verifyFormSubmissionCookieIsSet(context))
      return redirectUserTo(GeneralPageURLs.start);

    const draftRegistration: DraftRegistration = await getDraftRegistration(
      context.req.cookies[formSubmissionCookieId]
    );

    try {
      const result = await submitRegistration(
        draftRegistration,
        await getAccountHolderId(context.session)
      );

      clearFormSubmissionCookie(context);

      if (!result.beaconRegistered) {
        logger.error(
          `Failed to register beacon with hexId ${draftRegistration.hexId}. Check session cache for formSubmissionCookieId ${formSubmissionCookieId}`
        );
      }

      return {
        props: {
          reference: result.referenceNumber,
          registrationSuccess: result.beaconRegistered,
          confirmationEmailSuccess: result.confirmationEmailSent,
        },
      };
    } catch {
      logger.error(
        `Failed to register beacon with hexId ${draftRegistration.hexId}. Check session cache for formSubmissionCookieId ${formSubmissionCookieId}`
      );
      return {
        props: {
          registrationSuccess: false,
          confirmationEmailSuccess: false,
        },
      };
    }
  })
);

export default ApplicationCompletePage;
