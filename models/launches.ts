import * as log from "https://deno.land/std@0.125.0/log/mod.ts";
import * as _ from "https://deno.land/x/lodash@4.17.15-es/lodash.js";

interface Launch {
  flightNumber: number;
  mission: string;
  launchSite: object;
  rocket: string;
  customers: Array<string>;
  launchDate: number;
  upcoming: boolean;
  success?: boolean;
  target?: string;
}

let logger = log.getLogger();
const launches = new Map<number, Launch>();

export async function downloadLaunchData() {
  logger.info("Downloading launch data...");
  const response = await fetch("https://api.spacexdata.com/v3/launches", {
    method: "GET"
  });

  if (!response.ok) {
    logger.warning("Failed to download launch data");
    throw new Error("Error occurred when downloading launch data");
  }

  const data = await response.json();
  for (const launch of data) {
    const payloads = launch["rocket"]["second_stage"]["payloads"];
    const customers = _.flatMap(payloads, (payload: any): Array<string> => {
      return payload["customers"];
    });

    let flightData = {
      flightNumber: launch["flight_number"],
      mission: launch["mission_name"],
      launchSite: launch["launch_site"],
      rocket: launch["rocket"]["rocket_name"],
      customers: customers,
      launchDate: launch["launch_date_unix"],
      upcoming: launch["upcoming"],
      success: launch["launch_success"],
    }

    launches.set(flightData.flightNumber, flightData);
    logger.info(JSON.stringify(flightData));
  }
  
}

await downloadLaunchData();
logger.info(`Launch result size is ${launches.size} launch entities!`);

export function getAllLaunches() {
  return Array.from(launches.values());
}

export function getLaunchesById(id: number) {
  return getAllLaunches().filter(launch => launch.flightNumber === id);
}