import { IAccountHolderDetails } from "../entities/accountHolderDetails";
import { appContainer, IAppContainer } from "../lib/appContainer";
import { BeaconsGetServerSidePropsContext } from "../lib/container";

export type GetOrCreateAccountHolderFn = (
  context: BeaconsGetServerSidePropsContext
) => Promise<IAccountHolderDetails>;

export const getOrCreateAccountHolder =
  ({
    userSessionGateway,
    beaconsApiAuthGateway,
    accountHolderApiGateway,
  }: Partial<IAppContainer> = appContainer): GetOrCreateAccountHolderFn =>
  async (context: BeaconsGetServerSidePropsContext) => {
    const session = await userSessionGateway.getSession(context);
    const authId: string = session.user.authId;
    const email: string = session.user.email;
    const accessToken = await beaconsApiAuthGateway.getAccessToken();

    const accountHolderId = await accountHolderApiGateway.getAccountHolderId(
      authId,
      accessToken
    );

    if (accountHolderId)
      return await accountHolderApiGateway.getAccountHolderDetails(
        accountHolderId,
        accessToken
      );

    return await accountHolderApiGateway.createAccountHolder(
      authId,
      email,
      accessToken
    );
  };
