import "./DisplayCard.css";
import {
  Trash,
  Pen,
  Instagram,
  Twitter,
  Linkedin,
  CameraReels,
  Globe,
} from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import { deleteDeal, setSelectedDeal } from "../../redux/createDealSlice";
import {
  deleteInvestorDetailsInDatabse,
  deleteMedia,
} from "../../firebase/firebase";
import EditModal from "../editmodal/EditModal";
import { useEffect, useState } from "react";

const DisplayCard = ({ data }) => {
  console.log(data);
  const dispatch = useDispatch();
  const [para, setPara] = useState();
  const [showModal, setShowModal] = useState(false);
  
  useEffect(()=>{
    if(data){
      var tempPara = []
      data.body.map((item,index)=>{
          if(item!=undefined)
          {
          if(item.split(' ')[0] == "Image"&& item.split(' ')[1] == "Credits:"){
              console.log(item)
          }else{
              tempPara.push(<p style={{color: "black", fontSize: "17px"}}>{item}</p> )
          }
          }
          
     })
     setPara(tempPara)
    }
  },[])
  return (
    <div className="display-card__wrap">
        <div style={{textAlign: "justify", marginTop:"3%"}}>
            <div style={{width: "64%", marginLeft: "18%"}}>
                <h1 style={{color: "black", letterSpacing: "normal", wordSpacing: "normal", fontWeight: "900"}}>{data?.heading} </h1>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <p style={{color: "black", marginTop: "4px"}}>{data?.author}</p>
                    <p style={{color: "grey", fontSize: "13px", marginTop: "8px"}}>{data?.timestamp}</p>
                </div>
            </div>
            <div style={{textAlign: "center"}}>
                <img  style={{aspectRatio: 19 / 9, height: "400px", width:"90%", boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px "}} src={data?.img} alt=""/>
            </div>
            <div style={{width: "70%", marginLeft: "15%", marginTop: "50px"}}>
                {para}
            </div>
        </div>
    </div>
  );
};

export default DisplayCard;
