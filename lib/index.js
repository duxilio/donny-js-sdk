// setup Donny
import DonnyLib from "./Donny";
// setup the Event Dispatcher Horizon
import { Horizon } from "./Base/Dispatcher";

// setup the default configs
const config = {
  api_uri: "https://api.donny.fund",
  api_version: "v1.0"
};

// export a donny lib instance setup with a fresh horizon and config
export default conf => new DonnyLib({ ...config, ...conf }, new Horizon());
