import { useParams } from 'react-router-dom'
import Question from './Question'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { serverEndpoint } from '../config/appConfig';

const Room = () => {
  const {code} = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setErrors] = useState({});
  const [room, setRoom] = useState(null);
  const [questions, setQuestions] = useState([]);

  const fetchRoom = async() => {
    try{
      const response = await axios.post(`${serverEndpoint}/room/${code}`,{},{
        withCredentials:true
      });

      setRoom(response.data);
    } catch(error){
      console.log(error);
      setErrors({message: 'Unable to fetch from deatails, please try again'})
    }
  }

  const fetchQuestions = async() => {
    try{
      const response = await axios.post(`${serverEndpoint}/room/${code}`,{},{
        withCredentials:true
      });
      setQuestions(response.data)
    }catch(error){
      console.log(error);
      setErrors({message: 'Unable to fetch  questions, please try again'})
    }
  }

  useEffect(() => {

  },[]);
  
  return (
    <div className='container py-5'>
        <h2>Room {code}</h2>
        <Question roomCode={code}/>
    </div>
  )
}

export default Room