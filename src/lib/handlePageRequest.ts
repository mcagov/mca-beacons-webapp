import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  Redirect,
} from "next";
import { FormJSON, FormManager } from "./form/formManager";
import { CacheEntry } from "./formCache";
import {
  BeaconsContext,
  decorateGetServerSidePropsContext,
  getCache,
  updateFormCache,
  withCookieRedirect,
} from "./middleware";
import { Registration } from "./registration/registration";

type TransformCallback = (formData: CacheEntry) => CacheEntry;

export type SuccessfulPostCallback = (
  formData: CacheEntry
) => { redirect: Redirect };

export type FormManagerFactory = (formData: CacheEntry) => FormManager;

export interface FormPageProps {
  form: FormJSON;
  showCookieBanner?: boolean;
  submissionId?: string;
}

export const handlePageRequest = (
  destinationIfValid: string,
  formManagerFactory: FormManagerFactory,
  transformCallback: TransformCallback = (formData: CacheEntry) => formData,
  onSuccessfulPostCallback: SuccessfulPostCallback = () => {
    return { redirect: { statusCode: 303, destination: destinationIfValid } };
  }
): GetServerSideProps =>
  withCookieRedirect(async (context: GetServerSidePropsContext) => {
    const beaconsContext: BeaconsContext = await decorateGetServerSidePropsContext(
      context
    );
    const userDidSubmitForm = beaconsContext.req.method === "POST";

    if (userDidSubmitForm) {
      return handlePostRequest(
        beaconsContext,
        formManagerFactory,
        transformCallback,
        onSuccessfulPostCallback
      );
    }

    return handleGetRequest(beaconsContext, formManagerFactory);
  });

const handleGetRequest = (
  context: BeaconsContext,
  formManagerFactory: FormManagerFactory
): GetServerSidePropsResult<FormPageProps> => {
  const registration: Registration = getCache(context.submissionId);
  const flattenedRegistration = registration.getFlattenedRegistration({
    useIndex: parseInt(context.query.useIndex as string),
  });
  const formManager = formManagerFactory(flattenedRegistration);

  return {
    props: {
      form: formManager.serialise(),
      showCookieBanner: context.showCookieBanner,
      submissionId: context.submissionId,
    },
  };
};

const handlePostRequest = async (
  context: BeaconsContext,
  formManagerFactory: FormManagerFactory,
  transformCallback: TransformCallback = (formData) => formData,
  onSuccessfulFormPostCallback
): Promise<GetServerSidePropsResult<FormPageProps>> => {
  const transformedFormData = transformCallback(context.formData);
  updateFormCache(context.req.cookies, transformedFormData);

  const formManager = formManagerFactory(transformedFormData);
  formManager.markAsDirty();
  const formIsValid = !formManager.hasErrors();

  if (formIsValid) {
    return onSuccessfulFormPostCallback(transformedFormData);
  }

  return {
    props: {
      form: formManager.serialise(),
      showCookieBanner: context.showCookieBanner,
      submissionId: context.submissionId,
    },
  };
};
