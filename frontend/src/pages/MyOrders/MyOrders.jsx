import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../components/context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon path issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(null);
  const [location, setLocation] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(`${url}/api/order/userorders`, {}, {
        headers: { token }
      });
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleTrackOrder = (index) => {
    setSelectedOrderIndex(index);
    navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        (err) => {
          console.error("Geolocation error:", err);
          alert("Unable to access location.");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
      
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {
          data.map((order, index) => {
            const showMap = selectedOrderIndex === index && location;

            return (
              <div key={index} className='my-orders-order'>
                <img src={assets.parcel_icon} alt="" />
                <p>
                  {order.items.map((item, idx) => `${item.name} x ${item.quantity}`).join(", ")}
                </p>
                <p>${order.amount}.00</p>
                <p>Items: {order.items.length}</p>
                <p><span>&#x25cf;</span><b>{order.status}</b></p>
                <button onClick={() => handleTrackOrder(index)}>Track Order</button>

                {showMap && (
                  <div className='map-wrapper'>
                    <MapContainer center={location} zoom={14} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                      />
                      <Marker position={location}>
                        <Popup>Your current location</Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                )}
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export default MyOrders;
