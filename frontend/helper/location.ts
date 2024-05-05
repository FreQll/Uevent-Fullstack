import {
    setKey,
    setDefaults,
    setLanguage,
    setRegion,
    fromAddress,
    fromLatLng,
    fromPlaceId,
    setLocationType,
    geocode,
    RequestType,
} from "react-geocode";

// Alternatively

// Set Google Maps Geocoding API key for quota management (optional but recommended).
// Use this if you want to set the API key independently.
setKey('AIzaSyD7VAcqhO0I1IHQvuuyzmuw6gaENH9y8Nc'); // Your API key here.

setLanguage("en"); 
setRegion("ua"); 

// Get address from latitude & longitude.

export enum AddressFormats {
  LONG,
  SHORT,
  CITY
}

export const getAddressByCoords = (latitude: number, longitude: number, format?: AddressFormats): Promise<string> => {
  if (!format) format = AddressFormats.LONG;
  return new Promise((resolve, reject) => {
    geocode(RequestType.LATLNG, `${latitude},${longitude}`)
      .then(({ results }) => {
        let location;
        if (format == AddressFormats.LONG) location = results[results.length - 1].formatted_address + ', ' + results[2].address_components[0].short_name;
        if (format == AddressFormats.SHORT) location = results[2].address_components[0].short_name;
        if (format == AddressFormats.CITY) location = results[results.length - 1].formatted_address;
        
        resolve(location);
      })
      .catch(error => {
          console.error(error);
          reject(error);
      });
});
}

