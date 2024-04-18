"use client"

import { useState } from "react"
import Accordion from '@mui/material/Accordion';

import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';



const FAQCard = ({question, answer}) =>{
    const [isClicked, setIsClicked] = useState(false)

    const clickHandler = () =>{
        setIsClicked(!isClicked)
    }
    return(
    //     <div className={`p-4 rounded-2xl py-5 sm:py-6 px-6 sm:px-4 mt-10  shadow bg-white`}>
    //     <div className="flex justify-between items-center gap-12">
    //     <h3 className="font-semibold">{question}</h3>

    //     <div className={`flex items-center text-xl justify-center cursor-pointer`} onClick={clickHandler}>
         
    //       {isClicked ?  <i className="bi bi-caret-up-fill"></i> :<i className="bi bi-caret-down-fill"></i>}
    //     </div>
    //     </div>
    //     {isClicked && <div className="flex">
    //     <p className="mt-2 text-sm basis-3/4">{answer}</p>

    //     </div>
    //     }
        
    //   </div>
    <>
     <Accordion className="mt-6 p-3 rounded-lg">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          className="font-bold"
        >
          {question}
        </AccordionSummary>
        <AccordionDetails>
          {answer}
        </AccordionDetails>
      </Accordion>
    
    </>
    )
}

export default FAQCard