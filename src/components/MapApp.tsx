import { useState, useEffect, useRef } from 'react';
import { Menu, Search, MapPin, ZoomIn, ZoomOut, Crosshair } from 'lucide-react';
import { GoogleMap, useJsApiLoader, OverlayView } from '@react-google-maps/api';
import mapImg1 from '../Img/live_map1.png'
import mapImg2 from '../Img/live_map2.png'
import Toyota from '../Img/TOYOTA.png'
import Nissan from '../Img/png-transparent-nissan-logo-car-logos.png'
import Honda from '../Img/honda-1596081_1280.webp'
import Mazda from '../Img/png-transparent-mazda-logo-mazda-rx-8-car-mazda-premacy-mazda-familia-mazda-emblem-text-trademark-thumbnail.png'
import Suzuki from '../Img/Suzuki_logo_2.svg.png'
import Daihatsu from '../Img/Daihatsu_motor_co_logo.png'
import Lexus from '../Img/r0004.png'
import Benz from '../Img/mercedes-benz-hd-logo.png'
import Subaru from '../Img/Subaru.png'
import Mitsubishi from '../Img/1024px-Mitsubishi-logo.png'

const MapApp = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapDisplayMode, setMapDisplayMode] = useState('far');
  const mapRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);

  interface Pin {
    id: number;
    position: {
      lat: number;
      lng: number;
    };
    image: string;
    title: string;
  }
  
  interface PinGroup {
    pins: Pin[];
    center: {
      lat: number;
      lng: number;
    };
  }
  
  interface Groups {
    [key: string]: PinGroup;
  }
  
  interface Category {
    id: string;
    name: string;
    color: string;
  }

  interface CustomPinProps {
    pin: Pin;
  }
  

  const getPinGroups = (): PinGroup[] => {
    const gridSize = 0.0008;
    const groups: Groups = {};
    
    pins.forEach(pin => {
      const gridX = Math.floor(pin.position.lng / gridSize);
      const gridY = Math.floor(pin.position.lat / gridSize);
      const key = `${gridX}-${gridY}`;
      
      if (!groups[key]) {
        groups[key] = {
          pins: [],
          center: {
            lat: (gridY * gridSize) + (gridSize / 2),
            lng: (gridX * gridSize) + (gridSize / 2)
          }
        };
      }
      groups[key].pins.push(pin);
    });
    
    return Object.values(groups);
  };

  const ZOOM_LEVELS = {
    MEDIUM: 16,
    CLOSE: 18
  };

  const BIGSITE_CENTER = { lat: 35.6298243, lng: 139.7962834 };
  // const BIGSITE_BOUNDS = {
  //   north: 35.630419,
  //   south: 35.629229,
  //   east: 139.797133,
  //   west: 139.795533
  // };

  const [center, setCenter] = useState(BIGSITE_CENTER);
  const defaultZoom = 16;
  const [zoom] = useState(defaultZoom);
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

  const categories: Category[] = [
    { id: 'gourmet', name: 'グルメ', color: 'rgb(226, 39, 129)' },
    { id: 'shopping', name: 'ショッピング', color: 'rgb(24, 145, 96)' },
    { id: 'sightseeing', name: '観光', color: 'rgb(31, 66, 243)' }
  ];

  const pins = [
    { id: 1, position: { lat: 35.6298243, lng: 139.7962834 }, image: Toyota, title: 'トヨタ自動車' },
    { id: 2, position: { lat: 35.6297, lng: 139.7960 }, image: Nissan, title: '日産自動車' },
    { id: 3, position: { lat: 35.6299, lng: 139.7964 }, image: Honda, title: 'ホンダ' },
    { id: 4, position: { lat: 35.6296, lng: 139.7961 }, image: Subaru, title: 'スバル' },
    { id: 5, position: { lat: 35.6305, lng: 139.7969 }, image: Mazda, title: 'マツダ' },
    { id: 6, position: { lat: 35.6295, lng: 139.7962 }, image: Suzuki, title: 'スズキ' },
    { id: 7, position: { lat: 35.6298, lng: 139.7965 }, image: Daihatsu, title: 'ダイハツ' },
    { id: 8, position: { lat: 35.6297, lng: 139.7963 }, image: Mitsubishi, title: '三菱自動車' },
    { id: 9, position: { lat: 35.6299, lng: 139.7961 }, image: Lexus, title: 'レクサス' },
    { id: 10, position: { lat: 35.6296, lng: 139.7964 }, image: Benz, title: 'メルセデス・ベンツ' }
  ];

  const mapOptions = {
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    gestureHandling: 'greedy',
    minZoom: 14,
    maxZoom: 20,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ]
  };

  useEffect(() => {
    if (map) {
      const handleZoomChanged = () => {
        const currentZoom = map.getZoom();
        if (typeof currentZoom === 'number') {
          if (currentZoom >= ZOOM_LEVELS.CLOSE) {
            setMapDisplayMode('close');
          } else if (currentZoom >= ZOOM_LEVELS.MEDIUM) {
            setMapDisplayMode('medium');
          } else {
            setMapDisplayMode('far');
          }
  
          const baseZoom = 16;
          const newScale = Math.pow(2, currentZoom - baseZoom);
          setScale(newScale);
        }
      };

      map.addListener('zoom_changed', handleZoomChanged);
      return () => {
        google.maps.event.clearListeners(map, 'zoom_changed');
      };
    }
  }, [map]);

  const handleZoomIn = () => {
    if (map && typeof map.getZoom() === 'number') {
      map.setZoom((map.getZoom() || defaultZoom) + 1);
    }
  };

  const handleZoomOut = () => {
    if (map && typeof map.getZoom() === 'number') {
      map.setZoom((map.getZoom() || defaultZoom) - 1);
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
      getPixelPositionOffset={() => ({
        x: -100,
        y: -75
      })}
    >
      <div className="fixed-overlay">
        <img
          src={mapDisplayMode !== 'far' ? mapImg1 : mapImg2}
          alt="Bigsite Map"
          style={{
            width: '200px',
            height: '150px',
            opacity: 1,
            transform: `scale(${scale})`,
            willChange: 'transform',
            transition: 'transform 0.3s ease-out'
          }}
        />
      </div>
    </OverlayView>
  );

  const GroupedPins = () => {
    const groups = getPinGroups();
    
    return groups.map((group, index) => (
      <OverlayView
        key={index}
        position={group.center}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        getPixelPositionOffset={(width, height) => ({
          x: -(width / 2),
          y: -(height / 2)
        })}
      >
        <div className="relative group">
          <div className="w-12 h-12 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center text-white font-bold touch-target">
            {group.pins.length}
          </div>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {`${group.pins.length}件の出展`}
          </div>
        </div>
      </OverlayView>
    ));
  };

  const CustomPin: React.FC<CustomPinProps> = ({ pin }) => {
    const renderPin = () => {
      switch (mapDisplayMode) {
        case 'close':
          return (
            <div className="relative group touch-target" onClick={() => setSelectedPin(pin)}>
              <div className="w-12 h-12 rounded-full bg-blue-500 border-2 border-white overflow-hidden shadow-lg cursor-pointer">
                <img
                  src={pin.image}
                  alt={pin.title}
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {pin.title}
              </div>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <OverlayView
        position={pin.position}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        getPixelPositionOffset={(width, height) => ({
          x: -(width / 2),
          y: -(height / 2)
        })}
      >
        <div className="transition-opacity duration-300">
          {renderPin()}
        </div>
      </OverlayView>
    );
  };

  return (
    <div className="relative w-full h-screen bg-gray-100 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 bg-white shadow-md z-10">
        <div className="flex items-center p-2 gap-2">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-full touch-target"
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

        <div className="flex overflow-x-auto px-2 pb-2 gap-2 hide-scrollbar">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full touch-target ${
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
            {mapDisplayMode === 'close' && pins.map(pin => (
              <CustomPin key={pin.id} pin={pin} />
            ))}
            {mapDisplayMode === 'medium' && <GroupedPins />}
            {mapDisplayMode === 'far' && null}
          </GoogleMap>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-500">Loading...</div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between p-4 gap-4">
        <button 
          onClick={handleLocationClick}
          className="flex items-center bg-white rounded-full px-4 py-2 shadow-lg touch-target"
        >
          <MapPin size={20} className="mr-2" />
          <span>現在地</span>
        </button>

        <div className="flex items-center bg-white rounded-full shadow-lg">
          <button 
            onClick={handleZoomOut}
            className="p-3 hover:bg-gray-50 active:bg-gray-100 rounded-l-full border-r border-gray-200 touch-target"
          >
            <ZoomOut size={24} />
          </button>
          <button 
            onClick={resetView}
            className="p-3 hover:bg-gray-50 active:bg-gray-100 touch-target"
          >
            <Crosshair size={24} />
          </button>
          <button 
            onClick={handleZoomIn}
            className="p-3 hover:bg-gray-50 active:bg-gray-100 rounded-r-full touch-target"
          >
            <ZoomIn size={24} />
          </button>
        </div>
      </div>

      {selectedPin && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSelectedPin(null)}
        >
          <div 
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-lg overflow-hidden mr-4 bg-white">
                    <img
                      src={selectedPin.image}
                      alt={selectedPin.title}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedPin.title}</h3>
                    <p className="text-gray-600">出展企業</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPin(null)}
                  className="text-gray-500 hover:text-gray-700 p-2 touch-target"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">企業情報</h4>
                  <p className="text-gray-600">
                    サンプルテキストです。企業の詳細情報がここに表示されます。
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">出展内容</h4>
                  <p className="text-gray-600">
                    サンプルテキストです。出展内容の詳細情報がここに表示されます。
                  </p>
                </div>
                <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold touch-target">
                  詳細を見る
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

<style>
  {`
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .fixed-overlay {
      position: absolute;
      pointer-events: none;
      transform-origin: center;
      will-change: transform;
    }
    .touch-target {
      min-width: 44px;
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-center: center;
    }
  `}
</style>
    </div>
  );
};

export default MapApp;