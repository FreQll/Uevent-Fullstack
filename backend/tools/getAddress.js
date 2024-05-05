import { createClient } from "@google/maps";

const googleMapsClient = createClient({
  key: process.env.GOOGLE_API_KEY,
  Promise: Promise,
});

export async function getAddressFromCoordinates(lat, long) {
  const response = await googleMapsClient
    .reverseGeocode({ latlng: [lat, long] })
    .asPromise();
  if (response.json.results && response.json.results.length > 0) {
    return response.json.results[0].formatted_address;
  } else {
    throw new Error("No address found for this coordinates");
  }
}
