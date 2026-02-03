interface MapLocation {
  name: string;
  description: string;
  coordinates?: string;
  link?: string;
}

interface InteractiveMapProps {
  title: string;
  embedUrl?: string;
  locations?: MapLocation[];
  height?: string;
}

export default function InteractiveMap({ 
  title, 
  embedUrl, 
  locations,
  height = '450px' 
}: InteractiveMapProps) {
  return (
    <div className="my-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      
      {embedUrl ? (
        <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200">
          <iframe
            src={embedUrl}
            width="100%"
            height={height}
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      ) : (
        <div 
          className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg p-8 flex items-center justify-center text-center border border-blue-200"
          style={{ height }}
        >
          <div>
            <div className="text-6xl mb-4">🗺️</div>
            <p className="text-gray-700 font-medium">
              Interactive map placeholder
            </p>
          </div>
        </div>
      )}
      
      {locations && locations.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {locations.map((location, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📍</span>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1">{location.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{location.description}</p>
                  {location.coordinates && (
                    <p className="text-xs text-gray-500">{location.coordinates}</p>
                  )}
                  {location.link && (
                    <a
                      href={location.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View on Map →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
