/** Open the Google Maps app or website with a place search. */
export function googleMapsSearch(query: string) {
  const params = new URLSearchParams({ api: '1', query });
  return `https://www.google.com/maps/search/?${params}`;
}
