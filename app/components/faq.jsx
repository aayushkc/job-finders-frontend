"use client"
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';



const FAQCard = ({question, answer}) =>{
    return(
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