import { filterHabitablePlanets } from "./planets.ts";
import { assertEquals } from "https://deno.land/std@0.125.0/testing/asserts.ts";

const HABITABLE_PLANET = {
  "koi_disposition": "CONFIRMED",
  "koi_prad": "1",
  "koi_smass": "1",
  "koi_srad": "1",
}

const FALSE_POSITIVE = {
  "koi_disposition": "FALSE_POSITIVE",
  "koi_prad": "1",
  "koi_smass": "1",
  "koi_srad": "1",
}

const TOO_BIG_PLANETARY_RADIUS = {
  "koi_disposition": "CONFIRMED",
  "koi_prad": "1.5",
  "koi_smass": "1",
  "koi_srad": "1",
}

const TOO_BIG_PLANETARY_MASS = {
  "koi_disposition": "CONFIRMED",
  "koi_prad": "1",
  "koi_smass": "1.04",
  "koi_srad": "1",
}

const TOO_BIG_STELLAR_RADIUS = {
  "koi_disposition": "CONFIRMED",
  "koi_prad": "1",
  "koi_smass": "1",
  "koi_srad": "1.01",
}

Deno.test("testing filter planets", () => {
  assertEquals(
    filterHabitablePlanets([
      HABITABLE_PLANET,
      FALSE_POSITIVE,
      TOO_BIG_PLANETARY_MASS,
      TOO_BIG_PLANETARY_RADIUS,
      TOO_BIG_STELLAR_RADIUS
    ]), 
    [HABITABLE_PLANET]
  )
});