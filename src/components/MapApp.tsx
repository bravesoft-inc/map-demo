import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, MapPin, ZoomIn, ZoomOut, Crosshair } from 'lucide-react';
import { GoogleMap, useJsApiLoader, OverlayView } from '@react-google-maps/api';
import mapImg1 from '../Img/live_map1.png'
import mapImg2 from '../Img/live_map2.png'

const MapApp = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [map, setMap] = useState(null);
  const [showDetailedMap, setShowDetailedMap] = useState(false);
  const mapRef = useRef(null);

  // 東京ビッグサイトの座標と境界
  const BIGSITE_CENTER = { lat: 35.6298243, lng: 139.7962834 };
  const BIGSITE_BOUNDS = {
    north: 35.631419,
    south: 35.628229,
    east: 139.797833,
    west: 139.794733
  };
  const ZOOM_THRESHOLD = 17; // この値は実際の表示を見ながら調整してください

  const [center, setCenter] = useState(BIGSITE_CENTER);
  const [zoom, setZoom] = useState(16);

  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const loadApiKey = async () => {
      try {
        const response = await fetch('./ApiKey.json');
        const data = await response.json();
        setApiKey(data.ApiKey);
      } catch (error) {
        console.error('Error loading API key:', error);
      }
    };
    loadApiKey();
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  });

  const categories = [
    { id: 'gourmet', name: 'グルメ', color: 'rgb(226, 39, 129)' },
    { id: 'shopping', name: 'ショッピング', color: 'rgb(24, 145, 96)' },
    { id: 'sightseeing', name: '観光', color: 'rgb(31, 66, 243)' }
  ];

  const pins = [
    { 
      id: 1, 
      position: { lat: 35.6298243, lng: 139.7962834 }, 
      image: '/api/placeholder/50/50', 
      title: 'ビッグサイト'
    },
    { 
      id: 2, 
      position: { lat: 35.6287, lng: 139.7927 }, 
      image: '/api/placeholder/50/50', 
      title: 'シェルターワーフ'
    }
  ];

  const mapOptions = {
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ]
  };

  // ズームレベルの監視
  useEffect(() => {
    if (map) {
      const handleZoomChanged = () => {
        const currentZoom = map.getZoom();
        setShowDetailedMap(currentZoom >= ZOOM_THRESHOLD);
      };

      map.addListener('zoom_changed', handleZoomChanged);
      return () => {
        // Cleanup listener
        if (map) {
          google.maps.event.clearListeners(map, 'zoom_changed');
        }
      };
    }
  }, [map]);

  const handleZoomIn = () => {
    if (map) {
      map.setZoom(map.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.setZoom(map.getZoom() - 1);
    }
  };

  const resetView = () => {
    if (map) {
      map.setCenter(BIGSITE_CENTER);
      map.setZoom(16);
    }
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(pos);
          map?.panTo(pos);
        },
        () => {
          console.error('Error: The Geolocation service failed.');
        }
      );
    }
  };

  const CustomMapOverlay = () => (
    <OverlayView
      position={BIGSITE_CENTER}
      mapPaneName={OverlayView.OVERLAY_LAYER}
      getPixelPositionOffset={(width, height) => ({
        x: -(width / 2),
        y: -(height / 2)
      })}
    >
      <div className="relative pointer-events-none">
        <img
          src={showDetailedMap ? mapImg1 : mapImg2}
          alt="Bigsite Map"
          className="absolute w-[600px] h-[400px] object-cover opacity-70 transition-opacity duration-300"
          style={{
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>
    </OverlayView>
  );

  const CustomPin = ({ pin }) => (
    <OverlayView
      position={pin.position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={(width, height) => ({
        x: -(width / 2),
        y: -(height / 2)
      })}
    >
      <div 
        className={`relative group transition-opacity duration-300 ${
          showDetailedMap ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white overflow-hidden shadow-lg">
          <img
            src={pin.image}
            alt={pin.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {pin.title}
        </div>
      </div>
    </OverlayView>
  );

  return (
    <div className="relative w-full h-screen bg-gray-100 overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white shadow-md z-10">
        {/* Search Bar */}
        <div className="flex items-center p-2 gap-2">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1 relative">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <Search size={20} className="text-gray-500 flex-shrink-0" />
              <input 
                type="text"
                placeholder="検索"
                className="bg-transparent ml-2 w-full outline-none"
              />
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex overflow-x-auto px-2 pb-2 gap-2 hide-scrollbar">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-shrink-0 px-4 py-1 rounded-full ${
                selectedCategory === category.id 
                  ? 'text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
              style={{
                backgroundColor: selectedCategory === category.id 
                  ? category.color 
                  : undefined
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="w-full h-full pt-24" ref={mapRef}>
        {isLoaded ? (
          <GoogleMap
            mapContainerClassName="w-full h-full"
            center={center}
            zoom={zoom}
            options={mapOptions}
            onLoad={map => setMap(map)}
          >
            <CustomMapOverlay />
            {pins.map(pin => (
              <CustomPin key={pin.id} pin={pin} />
            ))}
          </GoogleMap>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-500">Loading...</div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between p-4 gap-4">
        <button 
          onClick={handleLocationClick}
          className="flex items-center bg-white rounded-full px-4 py-2 shadow-lg"
        >
          <MapPin size={20} className="mr-2" />
          <span>現在地</span>
        </button>

        <div className="flex items-center bg-white rounded-full shadow-lg">
          <button 
            onClick={handleZoomOut}
            className="p-3 hover:bg-gray-50 active:bg-gray-100 rounded-l-full border-r border-gray-200"
          >
            <ZoomOut size={24} />
          </button>
          <button 
            onClick={resetView}
            className="p-3 hover:bg-gray-50 active:bg-gray-100"
          >
            <Crosshair size={24} />
          </button>
          <button 
            onClick={handleZoomIn}
            className="p-3 hover:bg-gray-50 active:bg-gray-100 rounded-r-full"
          >
            <ZoomIn size={24} />
          </button>
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default MapApp;