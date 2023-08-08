import React from 'react'
import './style.css'

function Tabs({setIsRR, isRR}) {
  return (
    <div class="container">
        <div class="tabs">
            <input type="radio" id="radio-1" name="tabs" checked onClick={()=>setIsRR(false)}/>
            <label class="tab" style={{color: isRR? "black" :"#185ee0"}} for="radio-1">Tech lens</label>
            <input type="radio" id="radio-2" name="tabs"  onClick={()=>setIsRR(true)}/>
            <label class="tab" style={{color: isRR?"#185ee0": "black"}} for="radio-2">Rise Relationship</label>
            {/* <input type="radio" id="radio-3" name="tabs" />
            <label class="tab" for="radio-1">Upcoming<span class="notification">2</span></label> */}
            <span class="glider" style={{transform: isRR? "translateX(100%)" : "translateX(0%)"   }}></span>
        </div>
    </div>
  )
}

export default Tabs