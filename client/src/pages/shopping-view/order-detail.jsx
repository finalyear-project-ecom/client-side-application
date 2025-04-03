import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useParams } from "react-router-dom";
import axios from "axios";
import MapRender from "@/components/shopping-view/map";



function OrderDetail() {


    const location = useLocation();
    // const [orderDetails, setorderDetails] = useState(location.state);
    const { user } = useSelector((state) => state.auth);

    const { orderid } = useParams();

    const { orderList, orderDetails } = useSelector((state) => state.shopOrder);



    //map data

    const [productLocation, setProductLocation] = useState({ lat: 12.9716, lng: 77.5946 }); // Default: Bangalore
    const customerLocation = { lat: 13.0827, lng: 80.2707 }; // Chennai


    const API_BASE_URL = "http://localhost:5000"; // Change to your backend URL

    const fetchProductLocation = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/product-location`);
            setProductLocation(response.data);
            console.log(productLocation)
        } catch (error) {
            console.error("Error fetching product location:", error);
        }
    };

    // useEffect(() => {
    //   fetchProductLocation();
    // }, []);


    const refreshRoute = async () => {
        await fetchProductLocation(); // Ensure the latest location is fetched before rerendering
    };


    // map end


    console.log("the order details data", orderDetails)


    return (

        <div className="flexer">





            <div   className="sm:max-w-[45vw]">
                <div     className="grid gap-6">
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
                            <div className="grid gap-0.5">
                                <p style={{ fontWeight: "600" }}>Buyer Name : <span style={{ fontWeight: "normal" }}>{user.userName}</span></p>
                                <p style={{ fontWeight: "600" }}>Address : <span style={{ fontWeight: "normal" }}>{orderDetails?.addressInfo?.address}</span></p>
                                <p style={{ fontWeight: "600" }}>City : <span style={{ fontWeight: "normal" }}>{orderDetails?.addressInfo?.city}</span></p>
                                <p style={{ fontWeight: "600" }}>Phone : <span style={{ fontWeight: "normal" }}>{orderDetails?.addressInfo?.phone}</span></p>
                                <p style={{ fontWeight: "600" }}>Pincode : <span style={{ fontWeight: "normal" }}>{orderDetails?.addressInfo?.pincode}</span></p>
                                <p style={{ fontWeight: "600" }}>Notes : <span style={{ fontWeight: "normal" }}>{orderDetails?.addressInfo?.notes}</span></p>

                            </div>
                        </div>
                    </div>

                    <button
                        onClick={refreshRoute}
                        style={{ marginTop: "10px", padding: "10px", background: "blue", color: "white", border: "none", cursor: "pointer" }}
                    >
                        Refresh Location
                    </button>

                </div>
            </div>

            <MapRender productLocation={{lat:orderDetails?.productLocation?.lat , lng:orderDetails?.productLocation?.lng}} customerLocation={{lat:orderDetails?.addressInfo?.lat , lng:orderDetails?.addressInfo?.lng}} />
            


        </div>


    );
}

export default OrderDetail;