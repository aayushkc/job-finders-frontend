import { useEffect, useRef, useState } from "react";
import { Poppins } from 'next/font/google';

const poppin = Poppins({ subsets: ["latin"], display: 'swap', weight: ['500', '700'] });

export default function CountDown({ time, handleTimeFinshed, stopTimer,setTimeTakenToComplete }) {
    const [timer, setTimer] = useState(time || '00:00:00');
    const ref = useRef(null);

    const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = String(Math.floor((total / 1000) % 60)).padStart(2, '0');
        const minutes = String(Math.floor((total / 1000 / 60) % 60)).padStart(2, '0');
        const hours = String(Math.floor((total / 1000 / 60 / 60) % 24)).padStart(2, '0');
        setTimeTakenToComplete(`${hours}:${minutes}:${seconds}`)
        return {
            total,
            timeString: `${hours}:${minutes}:${seconds}`
        };
    };

    const startTimer = (e) => {
        let { total, timeString } = getTimeRemaining(e);

        if (total >= 0) {
            setTimer(timeString);
        } else {
            setTimeTakenToComplete('00:00:00')
            handleTimeFinshed();
            clearInterval(ref.current);
        }
    };

    const clearTimer = (e) => {
        if (ref.current) clearInterval(ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000);
        ref.current = id;
    };

    const getDeadTime = () => {
        let deadline = new Date();

        const [hours, minutes, seconds] = time.split(":").map(Number);
        console.log(time);
        
        deadline.setHours(deadline.getHours() + hours);
        deadline.setMinutes(deadline.getMinutes() + minutes);
        deadline.setSeconds(deadline.getSeconds() + seconds);
        console.log(deadline);
        
        return deadline;
    };

    useEffect(() => {
        if(!stopTimer){
            const deadline = getDeadTime();
            clearTimer(deadline);
        }else{
            clearInterval(ref.current)
        }
       

        return () => clearInterval(ref.current);
    }, [time, stopTimer]);

    return (
        <h2 className={`${poppin.className} text-lg sm:text-2xl font-medium`}>
            <span className="text-xl sm:text-3xl font-bold">{timer}</span> seconds remaining
        </h2>
    );
}
