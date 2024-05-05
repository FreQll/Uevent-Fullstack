"use client";

import { Loader } from "@googlemaps/js-api-loader";
import { Autocomplete } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";

export default function LocationPicker({
  lat,
  lng,
  onLocationSelected,
}: {
  lat: number;
  lng: number;
  onLocationSelected: (lat: number, lng: number) => void;
}) {
  // ...
  const mapRef = useRef<HTMLDivElement>(null);

  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete>();

  const position = { lat, lng };

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
        version: "weekly",
        libraries: ["places"],
      });

      const { Map } = await loader.importLibrary("maps");
      const { Marker } = (await loader.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;

      const mapOptions: google.maps.MapOptions = {
        center: position,
        zoom: 15,
        mapId: "MY_NEXTJS_MAPID",
      };

      const map = new Map(mapRef.current as HTMLDivElement, mapOptions);

      const marker = new Marker({
        map: map,
        position: position,
      });

      const autocompleteInput = document.getElementById(
        "autocomplete"
      ) as HTMLInputElement;
      const autocompleteOptions = {
        fields: ["place_id", "geometry", "name"],
      };

      const autocomplete = new google.maps.places.Autocomplete(
        autocompleteInput,
        autocompleteOptions
      );
      setAutocomplete(autocomplete);

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();

        if (!place.geometry) {
          window.alert("No details available for input: '" + place.name + "'");
          return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          if (place.geometry.location) {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
          }
        }

        marker.setPosition(place.geometry.location);

        if (place.geometry) {
          const lat = place.geometry.location?.lat();
          const lng = place.geometry.location?.lng();

          if (lat && lng) {
            onLocationSelected(lat, lng);
            console.log(lat, lng);
          }
        }
      });
    };

    initMap();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <input id="autocomplete" type="text" className="w-[100%] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300" />
      <div className="!h-[400px]" ref={mapRef} />
    </div>
  );
}
