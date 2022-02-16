
import { BufReader } from "https://deno.land/std@0.125.0/io/buffer.ts";
import { parse } from "https://deno.land/std@0.125.0/encoding/csv.ts";
import * as _ from "https://deno.land/x/lodash@4.17.15-es/lodash.js";
import { join } from "https://deno.land/std@0.125.0/path/mod.ts";

type Planet = Record<string, string>;

let planets: Array<Planet>;

async function loadPlanetsData() {
  const pathName = join("data", "NASA_exoplanet.csv");
  const file = await Deno.open(pathName);
  const bufReader = new BufReader(file);
  const result = await parse(bufReader, {
    skipFirstRow: true,
    comment: "#",
  });

  Deno.close(file.rid);

  const planets = (result as Array<Planet>).filter(planet => {
    const planetaryRadius = Number(planet["koi_prad"]);
    const planetaryMass = Number(planet["koi_smass"]);
    const stellarRadius = Number(planet["koi_srad"]);

    return planet["koi_disposition"] === "CONFIRMED" 
    && planetaryRadius > 0.5 && planetaryRadius < 1.5
    && planetaryMass > 0.78 && planetaryMass < 1.04
    && stellarRadius > 0.99 && stellarRadius < 1.01;
  });

  return planets.map((planet) => {
    return _.pick(planet, [
      "koi_prad",
      "koi_smass",
      "koi_srad",
      "kepler_name",
      "koi_steff",
      "koi_count",
      "kepid",
      "koi_period"
    ])
  });
}

planets = await loadPlanetsData();

export function getAllPlanets() {
  return planets;
}