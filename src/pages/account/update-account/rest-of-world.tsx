import { GetServerSideProps } from "next";
import React, { FunctionComponent } from "react";
import { Button } from "../../../components/Button";
import { FormErrorSummary } from "../../../components/ErrorSummary";
import {
  Form,
  FormFieldset,
  FormGroup,
  FormLegendPageHeading,
} from "../../../components/Form";
import { Grid } from "../../../components/Grid";
import { FormInputProps, Input } from "../../../components/Input";
import { Layout } from "../../../components/Layout";
import { IfYouNeedHelp } from "../../../components/Mca";
import { Select, SelectOption } from "../../../components/Select";
import { GovUKBody, SectionHeading } from "../../../components/Typography";
import { AccountHolder } from "../../../entities/AccountHolder";
import { FieldManager } from "../../../lib/form/FieldManager";
import { FormJSON, FormManager } from "../../../lib/form/FormManager";
import { Validators } from "../../../lib/form/Validators";
import { FormManagerFactory } from "../../../lib/handlePageRequest";
import { BeaconsGetServerSidePropsContext } from "../../../lib/middleware/BeaconsGetServerSidePropsContext";
import { withContainer } from "../../../lib/middleware/withContainer";
import { withSession } from "../../../lib/middleware/withSession";
import { redirectUserTo } from "../../../lib/redirectUserTo";
import { AccountPageURLs } from "../../../lib/urls";
import { WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError } from "../../../router/rules/WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError";

export interface UpdateAccountPageProps {
  form: FormJSON;
  accountHolderDetails: AccountHolder;
}

const RestOfWorld: FunctionComponent<UpdateAccountPageProps> = ({
  form,
}: UpdateAccountPageProps): JSX.Element => {
  const pageHeading =
    "Update your details as the Beacon Registry Account Holder";

  return (
    <Layout title={pageHeading} showCookieBanner={false}>
      <Grid
        mainContent={
          <>
            <FormErrorSummary formErrors={form.errorSummary} />
            <Form>
              <FormGroup>
                <FormFieldset>
                  <FormLegendPageHeading>{pageHeading}</FormLegendPageHeading>
                  <GovUKBody>
                    We will send this person confirmation messages, certificates
                    and account reminders. You can provide details of the beacon
                    owner (if this is a different person or organisation) later.
                  </GovUKBody>
                </FormFieldset>

                <SectionHeading>About you</SectionHeading>
                <FullName
                  value={form.fields.fullName.value}
                  errorMessages={form.fields.fullName.errorMessages}
                />

                <TelephoneNumber
                  value={form.fields.telephoneNumber.value}
                  errorMessages={form.fields.telephoneNumber.errorMessages}
                />
                <RestOfWorldAccountHolderAddress form={form} />
              </FormGroup>
              <div className="govuk-button-group">
                <Button buttonText="Save these account details" />
                <a
                  className="govuk-link govuk-link--no-visited-state"
                  href={AccountPageURLs.accountHome}
                >
                  Cancel
                </a>
              </div>
            </Form>
            <GovUKBody>
              Your registered email address is {form.fields.email.value}.
              <br />
              We will send your registration confirmation and certificate to
              this email.
            </GovUKBody>
            <IfYouNeedHelp />
          </>
        }
      />
    </Layout>
  );
};

const FullName: FunctionComponent<FormInputProps> = ({
  value = "",
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <Input id="fullName" label="Your full name" defaultValue={value} />
  </FormGroup>
);

const TelephoneNumber: FunctionComponent<FormInputProps> = ({
  value = "",
  errorMessages,
}: FormInputProps): JSX.Element => (
  <FormGroup errorMessages={errorMessages}>
    <Input
      id="telephoneNumber"
      label="Telephone number"
      hintText="Search and rescue may use this to try you in an emergency. This can be a mobile or landline. For international numbers include the country code."
      defaultValue={value}
    />
  </FormGroup>
);

const RestOfWorldAccountHolderAddress: FunctionComponent<{ form: FormJSON }> =
  ({ form }: { form: FormJSON }): JSX.Element => (
    <FormGroup>
      <FormGroup errorMessages={form.fields.addressLine1.errorMessages}>
        <Input
          id="addressLine1"
          label="Address line 1"
          defaultValue={form.fields.addressLine1.value}
        />
      </FormGroup>
      <FormGroup errorMessages={form.fields.addressLine2.errorMessages}>
        <Input
          id="addressLine2"
          defaultValue={form.fields.addressLine2.value}
          label="Address line 2"
        />
      </FormGroup>
      <FormGroup>
        <Input
          id="addressLine3"
          label="Address line 3 (optional)"
          defaultValue={form.fields.addressLine3.value}
        />
      </FormGroup>
      <FormGroup>
        <Input
          id="addressLine4"
          label="Address line 4 (optional)"
          defaultValue={form.fields.addressLine4.value}
        />
      </FormGroup>
      <FormGroup>
        <Input
          id="postcode"
          label="Postal or zip code (optional)"
          defaultValue={form.fields.postcode.value}
        />
      </FormGroup>
      <FormGroup errorMessages={form.fields.country.errorMessages}>
        <label className="govuk-label" htmlFor="country">
          Country
        </label>
        <CountrySelect
          id="country"
          name="country"
          defaultValue={form.fields.country.value}
        />
      </FormGroup>
    </FormGroup>
  );

const userDidSubmitForm = (
  context: BeaconsGetServerSidePropsContext
): boolean => context.req.method === "POST";

export const getServerSideProps: GetServerSideProps = withSession(
  withContainer(async (context: BeaconsGetServerSidePropsContext) => {
    const rule = new WhenUserIsNotSignedIn_ThenShowAnUnauthenticatedError(
      context
    );
    if (await rule.condition()) {
      return rule.action();
    }

    const { parseFormDataAs, updateAccountHolder, getOrCreateAccountHolder } =
      context.container;

    if (!userDidSubmitForm(context)) {
      const accountHolder: AccountHolder = await getOrCreateAccountHolder(
        context.session
      );
      return {
        props: {
          form: restOfWorldFormManager(
            accountHolderToRestOfWorldUpdateFields(
              resetAddressFields(accountHolder)
            )
          ).serialise(),
        },
      };
    }

    const formData = await parseFormDataAs<RestOfWorldAccountUpdateFields>(
      context.req
    );
    const formManager = restOfWorldFormManager(formData).asDirty();
    if (formManager.hasErrors()) {
      return {
        props: {
          form: formManager.serialise(),
        },
      };
    }

    const accountHolder = await getOrCreateAccountHolder(context.session);
    await updateAccountHolder(
      accountHolder.id,
      formDataToRestOfWorldAccountHolder(formData)
    );

    return redirectUserTo(AccountPageURLs.accountHome);
  })
);

const resetAddressFields = (accountHolder: AccountHolder): AccountHolder => {
  const emptyAddressFields: Partial<AccountHolder> = {
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    addressLine4: "",
    townOrCity: "",
    county: "",
    country: "",
    postcode: "",
  };

  return {
    ...accountHolder,
    ...emptyAddressFields,
  };
};

export default RestOfWorld;

/**
 * Turns an account holder in to a set of update fields
 * @param accountHolder {AccountHolder} the account holder from which to populate these fields
 * @returns {RestOfWorldAccountUpdateFields} update field values from accountHolder or properties are undefined (to allow for obj diffing)
 */
const accountHolderToRestOfWorldUpdateFields = (
  accountHolder: AccountHolder
): RestOfWorldAccountUpdateFields => ({
  fullName: accountHolder.fullName || undefined,
  telephoneNumber: accountHolder.telephoneNumber || undefined,
  addressLine1: accountHolder.addressLine1 || undefined,
  addressLine2: accountHolder.addressLine2 || undefined,
  addressLine3: accountHolder.addressLine3 || undefined,
  addressLine4: accountHolder.addressLine4 || undefined,
  postcode: accountHolder.postcode || undefined,
  country: accountHolder.country || undefined,
  email: accountHolder.email,
});

const formDataToRestOfWorldAccountHolder = (
  formData: RestOfWorldAccountUpdateFields
): AccountHolder => {
  const emptyFields = {
    county: "",
    townOrCity: "",
  };
  return { ...formData, ...emptyFields } as AccountHolder;
};

interface RestOfWorldAccountUpdateFields {
  fullName: string;
  telephoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  addressLine4: string;
  postcode: string;
  country: string;
  email: string;
}

export const restOfWorldFormManager: FormManagerFactory = ({
  fullName,
  telephoneNumber,
  addressLine1,
  addressLine2,
  addressLine3,
  addressLine4,
  postcode,
  country,
  email,
}) => {
  return new FormManager({
    fullName: new FieldManager(fullName, [
      Validators.required("Enter your full name"),
    ]),
    telephoneNumber: new FieldManager(telephoneNumber, [
      Validators.required("Enter your telephone number"),
      Validators.phoneNumber(
        "Enter a telephone number, like 07700 982736 or +447700912738"
      ),
    ]),
    addressLine1: new FieldManager(addressLine1, [
      Validators.required("Enter the first line of your address"),
    ]),
    addressLine2: new FieldManager(addressLine2, [
      Validators.required("Enter the second line of your address"),
    ]),
    addressLine3: new FieldManager(addressLine3),
    addressLine4: new FieldManager(addressLine4),
    postcode: new FieldManager(postcode),
    country: new FieldManager(country, [
      Validators.required("Select your country"),
    ]),
    email: new FieldManager(email),
  });
};

interface CountrySelectProps {
  id: string;
  name: string;
  defaultValue: string;
}
const CountrySelect = ({
  id,
  name,
  defaultValue,
}: CountrySelectProps): JSX.Element => (
  <Select
    id={id}
    name={name}
    defaultValue={defaultValue || "Select your country"}
  >
    <option disabled selected value={undefined}>
      Select your country
    </option>
    {countries.map((country) => (
      <SelectOption key={country} value={country}>
        {country}
      </SelectOption>
    ))}
  </Select>
);

/**
 * @link https://www.gov.uk/government/publications/geographical-names-and-information
 */
const countries = [
  "Afghanistan",
  "Akrotiri",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda,Bermuda,Bermudan",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "British Antarctic Territory",
  "British Indian Ocean Territory",
  "British Virgin Islands",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Cayman Islands",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Congo (Democratic Republic)",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czechia",
  "Denmark",
  "Dhekelia",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "East Timor",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Falkland Islands",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Ivory Coast",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Myanmar (Burma)",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Pitcairn, Henderson, Ducie and Oeno Islands",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Georgia and South Sandwich Islands",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "St Helena, Ascension and Tristan da Cunha",
  "St Kitts and Nevis",
  "St Luciart",
  "St Vincent",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "The Bahamas",
  "The Gambia",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Turks and Caicos Islands",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];
