import { useDispatch, useSelector } from "react-redux";
import "./dashboard.css";
import { Link } from "react-router-dom";
import { addUniqueIdToFirebase, deleteRRBlog, deleteTLBlog, getInvestorDealsFromDatabase, getListOfUniqueId, getRRBlogs } from "../../firebase/firebase";
import { useEffect, useState } from "react";
import DisplayCard from "../../components/displaycard/DisplayCard";
import { HourglassSplit } from "react-bootstrap-icons";
import { setInvestorDeals } from "../../redux/createDealSlice";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SendFormToFonder from "../../components/Send Form To Fonder/SendFormToFonder";
import Tabs from "../../components/tabs/tabs";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  window.scroll(0, 0);
  const navigate=useNavigate()
const [isSendingFormBegin,setIsSendingFormBegin]=useState(false)
  const[sendFormClick,setSendFormClick]=useState(false)
  const [rrb, setRrb] = useState();
  const [isRR, setIsRR] = useState(false);
  const[sendFormData,setSendFormData]=useState({name:"",email:""})
  const [isLoading, setIsLoading] = useState(true);
  const getInvestorDeals = async () => {
    const results = await getInvestorDealsFromDatabase();
    if (results.length) {
      dispatch(setInvestorDeals([...results]));
    }
    const res2 = await getRRBlogs();
    if (res2.length) {
      setRrb(res2)
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getInvestorDeals();
  }, []);

  const deleteBlog = async(uid) =>{
    try{
      console.log(isRR)
      if(isRR){
        await deleteRRBlog(uid)
      }else{
        await deleteTLBlog(uid)
      }
      toast.success("Blog Deleted");
      setTimeout(()=>getInvestorDeals(), 1000)
      
    }catch(err){
      toast.error(err)
    }

  }

 const randomString=(length)=> {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}



const sendDealToFounder=(e)=>{
  e.preventDefault()
  setIsSendingFormBegin(true)
  let uniqueId=randomString(13);
  const link=`https://investor.reverr.io/form/${uniqueId}`
  let templateParams = {
    from_name: "Reverr",
    to_name: sendFormData.name,
    email: sendFormData.email,
    link,
  };

  emailjs.send(
          "service_lfmmz8k",
          "template_6lqwjap",
          templateParams,
          "dVExxiI8hYMCyc0sY"
        )
        .then(
          function (response) {
            console.log("SUCCESS!", response.status, response.text);
          },
        )
        .then(async()=>{
          let oldIdList=await getListOfUniqueId()
          console.log("oldIdList",oldIdList)
          let newIdList=[...oldIdList,uniqueId]
          await addUniqueIdToFirebase(newIdList)
        })
        .then(() => {
          setIsSendingFormBegin(false)
          setSendFormClick(false)
          toast.success("Form Send to Founder");
        })
        .catch((err)=>{
            console.log("FAILED...", err);
            setIsSendingFormBegin(false)

        })
}

  const investorDeals = useSelector((state) => state.investorDeals);
  // console.log("Dashboard : ", investorDeals);
  return (
    <>
    {sendFormClick?<SendFormToFonder setSendFormClick={setSendFormClick} handleClick={sendDealToFounder} setSendFormData={setSendFormData} isSendingFormBegin={isSendingFormBegin}/>:null}
      <div className="Dashboard_MainContainer">
      <ToastContainer/>
        <div className="Dashboard_Container">
          <div className="L_Container">
            <h1 style={{ color: "grey" }}>Admin</h1>
            {/* <h3>{user !== null ? user.user : "User"}</h3> */}
            <Link to="/create-deal">
              <button>Create Tech Lens Blog</button>
            </Link>
            <Link to="/create-dealRR" style={{marginTop:"20px"}}>
              <button>Create Rise Relationship Blog</button>
            </Link>
            {/* <Link style={{marginTop:"1rem"}} to="/pptTemplate">
              <button>Upload PPT Templates</button>
            </Link>
            <Link style={{marginTop:"1rem"}} to="/update-mentor">
              <button>update mentor details</button>
            </Link>
            <Link style={{marginTop:"1rem"}} to="/view-mentors">
              <button>View all mentors</button>
            </Link>
            <Link style={{marginTop:"1rem"}} to="/documentTemplate">
              <button>Upload Document Templates</button>
            </Link>
            <button onClick={()=>setSendFormClick(true)} style={{marginTop:"1rem"}}>Send Form To Founder</button> */}
            {/* <button onClick={() => dispatch(logout())}>Logout</button> */}
          </div>
          <div className="R_Container">
          
            {isLoading ? (
              <h3>
                Fetching <HourglassSplit /> Blogs
              </h3>
            ) : (
              <>
              <Tabs setIsRR={setIsRR} isRR={isRR}/>
              <div>
              {isRR ? 
              rrb.length>0 && rrb.map((data) => (
                <DisplayCard key={data.id} data={data} deleteBlog={deleteBlog} />
              )) 
              : 
              investorDeals.investorDeals.length>0 && investorDeals.investorDeals.map((data) => (
                <DisplayCard key={data.id} data={data} deleteBlog={deleteBlog}/>
              ))
              }
              </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
