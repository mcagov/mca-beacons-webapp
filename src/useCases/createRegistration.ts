import { BeaconsApiGateway } from "../gateways/beaconsApiGateway";
import { Registration } from "../lib/registration/registration";

export class CreateRegistration {
  private readonly registrationsEndpoint = "registrations/register";
  private apiGateway: BeaconsApiGateway;

  constructor(apiGateway: BeaconsApiGateway) {
    this.apiGateway = apiGateway;
  }

  public async execute(registration: Registration): Promise<boolean> {
    const registrationJson = registration.serialiseToAPI();

    return this.apiGateway.post(this.registrationsEndpoint, registrationJson);
  }
}
