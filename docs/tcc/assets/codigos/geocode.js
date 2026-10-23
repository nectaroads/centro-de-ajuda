async function getLocation(lat, lon) {
  const url = "https://maps.googleapis.com/maps/api/geocode/json" + `?latlng=${lat},${lon}` + `&key=${process.env.GOOGLEKEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return extractLocation(data);
}
function extractLocation(data) {
  const components = data.results[0].address_components;
  let street = null, neighborhood = null, city = null, state = null, country = null, zip = null;
  for (const component of components) {
    const types = component.types;
    if (types.includes("route")) street = component.long_name;
    if (types.includes("sublocality") || types.includes("sublocality_level_1") || types.includes("neighborhood")) neighborhood = component.long_name;
    if (types.includes("administrative_area_level_2")) city = component.long_name;
    if (types.includes("administrative_area_level_1")) state = component.long_name;
    if (types.includes("country")) country = component.long_name;
    if (types.includes("postal_code")) zip = component.long_name;
  }
  return { street, neighborhood, city, state, country, zip };
}
