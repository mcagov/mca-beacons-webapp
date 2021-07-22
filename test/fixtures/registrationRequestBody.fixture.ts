import { IRegistrationRequestBody } from "../../src/lib/registration/registrationRequestBody";
import {
  Activity,
  Environment,
  Purpose,
} from "../../src/lib/registration/types";

export const registrationRequestBodyFixture: IRegistrationRequestBody = {
  beacons: [
    {
      manufacturer: "manufacturer",
      model: "model",
      hexId: "hexId",
      referenceNumber: "referenceNumber",
      manufacturerSerialNumber: "manufacturerSerialNumber",
      chkCode: "chkCode",
      batteryExpiryDate: "batteryExpiryDate",
      lastServicedDate: "lastServicedDate",
      owner: {
        fullName: "ownerFullName",
        email: "ownerEmail",
        telephoneNumber: "ownerTelephoneNumber",
        alternativeTelephoneNumber: "ownerAlternativeTelephoneNumber",
        addressLine1: "ownerAddressLine1",
        addressLine2: "ownerAddressLine2",
        townOrCity: "ownerTownOrCity",
        county: "ownerCounty",
        postcode: "ownerPostcode",
      },
      emergencyContacts: [
        {
          fullName: "emergencyContact1FullName",
          telephoneNumber: "emergencyContact1TelephoneNumber",
          alternativeTelephoneNumber:
            "emergencyContact1AlternativeTelephoneNumber",
        },
        {
          fullName: "emergencyContact2FullName",
          telephoneNumber: "emergencyContact2TelephoneNumber",
          alternativeTelephoneNumber:
            "emergencyContact2AlternativeTelephoneNumber",
        },
        {
          fullName: "emergencyContact3FullName",
          telephoneNumber: "emergencyContact3TelephoneNumber",
          alternativeTelephoneNumber:
            "emergencyContact3AlternativeTelephoneNumber",
        },
      ],
      uses: [
        {
          environment: Environment.MARITIME,
          activity: Activity.SAILING,
          purpose: Purpose.PLEASURE,
          callSign: "callSign",
          vhfRadio: true,
          fixedVhfRadio: true,
          fixedVhfRadioValue: "0117",
          portableVhfRadio: true,
          portableVhfRadioValue: "0118",
          satelliteTelephone: true,
          satelliteTelephoneValue: "01161627",
          mobileTelephone: true,
          mobileTelephone1: "01178123456",
          mobileTelephone2: "01178123457",
          otherCommunication: true,
          otherCommunicationValue: "Via email",
          maxCapacity: 22,
          vesselName: "My lucky boat",
          portLetterNumber: "PLY22",
          homeport: "Bristol",
          areaOfOperation: "Newport",
          beaconLocation: "In my carry bag",
          imoNumber: "8814275",
          ssrNumber: "029 20448820",
          rssNumber: "123AKJHSDH",
          officialNumber: "BY1293",
          rigPlatformLocation: "On the rig",
          aircraftManufacturer: "Boeing",
          principalAirport: "Bristol",
          secondaryAirport: "Cardiff",
          registrationMark: "Reg mark",
          hexAddress: "3238ABCDE",
          cnOrMsnNumber: "NM819291",
          dongle: true,
          beaconPosition: "Carry bag",
          workingRemotelyLocation: "Bristol",
          workingRemotelyPeopleCount: "10",
          windfarmLocation: "Scotland",
          windfarmPeopleCount: "19",
          otherActivity: "On my boat",
          otherActivityLocation: "Taunton",
          otherActivityPeopleCount: "35",
          moreDetails: "Blue boat, tracked in SafeTrx",
          mainUse: true,
        },
        {
          environment: Environment.MARITIME,
          activity: Activity.SAILING,
          purpose: Purpose.PLEASURE,
          callSign: "callSign",
          vhfRadio: true,
          fixedVhfRadio: true,
          fixedVhfRadioValue: "0117",
          portableVhfRadio: true,
          portableVhfRadioValue: "0118",
          satelliteTelephone: true,
          satelliteTelephoneValue: "01161627",
          mobileTelephone: true,
          mobileTelephone1: "01178123456",
          mobileTelephone2: "01178123457",
          otherCommunication: true,
          otherCommunicationValue: "Via email",
          maxCapacity: 22,
          vesselName: "My lucky boat",
          portLetterNumber: "PLY22",
          homeport: "Bristol",
          areaOfOperation: "Newport",
          beaconLocation: "In my carry bag",
          imoNumber: "8814275",
          ssrNumber: "029 20448820",
          rssNumber: "123AKJHSDH",
          officialNumber: "BY1293",
          rigPlatformLocation: "On the rig",
          aircraftManufacturer: "Boeing",
          principalAirport: "Bristol",
          secondaryAirport: "Cardiff",
          registrationMark: "Reg mark",
          hexAddress: "3238ABCDE",
          cnOrMsnNumber: "NM819291",
          dongle: true,
          beaconPosition: "Carry bag",
          workingRemotelyLocation: "Bristol",
          workingRemotelyPeopleCount: "10",
          windfarmLocation: "Scotland",
          windfarmPeopleCount: "19",
          otherActivity: "On my boat",
          otherActivityLocation: "Taunton",
          otherActivityPeopleCount: "35",
          moreDetails: "Blue boat, tracked in SafeTrx",
          mainUse: false,
        },
      ],
    },
  ],
};
