import { useEffect, useState } from "react";
import { dateGenerator } from "../../utils/dategenerator";
import { uidGenerator } from "../../utils/uidgenerator";
import {
  addbloginTL,
  addbloginRR,
  getinvestorDealsFromDatabase,
  uploadMedia,
} from "../../firebase/firebase";
import "./createdeal.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HourglassSplit, Pen, Trash } from "react-bootstrap-icons";
import { keyGen } from "../../utils/keyGen";
import AddFaq from "../../components/addfaq/AddFaq";
import AddHighlight from "../../components/addHighlights/AddHighlight";
import AddInvestor from "../../components/addInvestor/AddInvestor";
import AddFounder from "../../components/addfounder/AddFounder";
import AddAdvisor from "../../components/addAdvisor/AddAdvisor";
import { useSelector } from "react-redux";
import Select from "react-select";
import Meetings from "../../components/meetings/Meetings";
import { useNavigate } from "react-router-dom";


const CreateDealRR = () => {
  const [author, setAuthor] = useState("");
  const [heading, setHeading] = useState("");
  const [img, setImg] = useState();
  const [body, setBody] = useState("");
  const [topic, setTopic] = useState("");
  const [dealsAddLoading, setDealsAddLoading] = useState(false);

const navigate=useNavigate()

const options = [
  { value: 'Dating', label: 'Dating' },
  { value: 'Relationships with family and friends', label: 'Relationships with family and friends' },
  { value: 'Relationships and mental health', label: 'Relationships and mental health' },
  { value: 'Relationships with professionals', label: 'Relationships with professionals' },
  { value: 'Relationships in different stages of life', label: 'Relationships in different stages of life' },
 
]
  

  const onAddDealHandler = async (e) => {
    e.preventDefault()
    setDealsAddLoading(true);
   
    try {
      let uid = uidGenerator();
      let addedOn = dateGenerator();
      let body2 = []
      body.split('\n').map( (para)=>{
        body2.push(para)
      })
     
      const logoImg = await uploadMedia(img, "Tlblog/images");
      
      const blogdata = {
        author,
        heading,
        img:logoImg,
        body:body2,
        timestamp:addedOn,
        topic,
      }
      console.log(blogdata)

      await addbloginRR(uid, blogdata);
      console.log("added");
      toast.success("blog Added")
      setTimeout(()=>{
      navigate("/dashboard")
      },1000)
      setDealsAddLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    <h1 style={{textAlign:"center"}}>Create blog for Rise Relationships</h1>
      <div className="main__deal">
        <form onSubmit={onAddDealHandler}>
          <fieldset style={{ display: "flex" }}>
            <legend>Blog details</legend>
            <input
              onChange={(e) => setHeading(e.target.value)}
              placeholder="Heading"
            />
            <input
              
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author"
            />
            <input
            style={{width:"55%"}}
              onChange={(e) => {
                const newDate = dateGenerator();
                if (e.target.files[0]) {
                  Object.defineProperty(e.target.files[0], "name", {
                    writable: true,
                    value: `${heading} ${newDate}`,
                  });
                  setImg(e.target.files[0]);
                }
              }}
              type="file"
            />
            <Select  options={options} onChange={(e)=>setTopic(e.value)} placeholder="Select Topic..."/>
            <textarea
              style={{width:"85%"}}
              rows="10"
              onChange={(e) => setBody(e.target.value)}
              placeholder="Body"
            />
           
           <button type="submit"  > Submit </button>
           
          </fieldset>
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default CreateDealRR;
