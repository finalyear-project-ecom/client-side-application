import { useState,useEffect } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";
import { MapContainer, TileLayer, Marker, Popup ,Polyline} from "react-leaflet";
import axios from "axios";

import { selectDeliveryBoy } from "@/store/delivery";

const initialFormData = {
  status: "",
};

const DeliveryinitialFormData = {
  deliveryId: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const [dformData, setdFormData] = useState(DeliveryinitialFormData);
  const { user } = useSelector((state) => state.auth);
  const { duser } = useSelector((state) => state.deliveryOrder);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(null);
  const [time, setTime] = useState(null);

  console.log(orderDetails?.productLocation?.lat, "orderDetailsorderDetails");
  console.log(duser, "delivery users");

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: data?.payload?.message,
        });
      }
    });
  }

   console.log(orderDetails)
  function handleSelectDeliveryBoy(event) {
    event.preventDefault();
    const { deliveryId } = dformData;

    console.log("the request came here")

    dispatch(
      selectDeliveryBoy({ id: orderDetails?._id, deliveryId: deliveryId })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: data?.payload?.message,
        });
      }
    });
  }

  
   


  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const fetchRoute = async () => {
      const apiKey = "5b3ce3597851110001cf6248b090b8b61cc64dab9d2598625e635fa7";
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${orderDetails.productLocation.lng},${orderDetails.productLocation.lat}&end=${orderDetails.addressInfo.lng},${orderDetails.addressInfo.lat}`;
  
      try {
        const response = await axios.get(url);
        const coordinates = response.data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
        setRoute(coordinates);
        setDistance((response.data.features[0].properties.summary.distance / 1000).toFixed(2));
        setTime((response.data.features[0].properties.summary.duration / 60).toFixed(2));
        setHasFetched(true);
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };
  
    if (
      orderDetails?.productLocation &&
      !hasFetched
    ) {
      fetchRoute();
    }
  }, [orderDetails, hasFetched]);



  return (
    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
      <div className="grid gap-6">

        <div className="map-section">


        <MapContainer
          center={[
            orderDetails?.productLocation?.lat || 10,
            orderDetails?.productLocation?.lng || 77,
          ]}
          zoom={13}
          style={{ height: "300px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker
            position={[
              orderDetails?.productLocation?.lat || 10,
              orderDetails?.productLocation?.lng || 77,
            ]}
          >
            <Popup>Product Location</Popup>
          </Marker>

     
        <Marker position={[  orderDetails?.addressInfo?.lat || 10, orderDetails?.addressInfo?.lng ||77]}>
          <Popup>Customer Location</Popup>
        </Marker>

        {route.length > 0 && <Polyline positions={route} color="black" />}


        </MapContainer>




          <h3>Delivery History</h3>
          <ul className="delivery-history" >
            {orderDetails?.deliveryHistory.map((person, index) => (
              <li key={index} style={{display:"flex" , justifyContent:"space-between",alignItems:"center", backgroundColor:"#E1D9D9",margin:"1rem",padding:"1rem"}}>
                {person?.name} - {new Date(person?.timestamp).toLocaleString()}
                <img src={orderDetails.productImages[index]} width={200}  />
              </li>
            ))}
          </ul>
        </div>


        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>${orderDetails?.totalAmount}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment method</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${orderDetails?.orderStatus === "confirmed"
                  ? "bg-green-500"
                  : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : "bg-black"
                  }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item) => (
                  <li className="flex items-center justify-between">
                    <span>Title: {item.title}</span>
                    <span>Quantity: {item.quantity}</span>
                    <span>Price: ${item.price}</span>
                  </li>
                ))
                : null}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user.userName}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>

        <div>
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "inProcess", label: "In Process" },
                  { id: "inShipping", label: "In Shipping" },
                  { id: "delivered", label: "Delivered" },
                  { id: "rejected", label: "Rejected" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Update Order Status"}
            onSubmit={handleUpdateStatus}
          />
        </div>
       
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </DialogContent >
  );
}

export default AdminOrderDetailsView;
