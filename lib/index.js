// setup Donny
import DonnyLib from "./Donny";

// setup the Event Dispatcher Horizon
import { Horizon } from "./Base/Dispatcher";

// setup the default configs
const config = {
  api_uri: "http://127.0.0.1:8832",
  api_version: "v1.0"
};

// export a donny lib instance setup with a fresh horizon and config
export default conf => new DonnyLib({ ...config, ...conf }, new Horizon());
