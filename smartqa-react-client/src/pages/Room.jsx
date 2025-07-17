import { useParams } from 'react-router-dom'
import Question from './Question'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { serverEndpoint } from '../config/appConfig';
import socket from '../config/socket';

const Room = () => {
  const {code} = useParams();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [room, setRoom] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [summaries, setSummaries] = useState([]);

  const fetchSummary = async () => {
    try{
      const response = await axios.get(`${serverEndpoint}/room/${code}/question/summary`,{
        withCredentials:true
      });
      setSummaries(response.data || []);
    } catch(error){
      console.log(error);
      setErrors({message : 'Unable to fetch top questions, please try again'});
    }
  }

  const fetchRoom = async() => {
    try{
      const response = await axios.get(`${serverEndpoint}/room/${code}`,{
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
      const response = await axios.get(`${serverEndpoint}/room/${code}/question`,{
        withCredentials:true
      });
      setQuestions(response.data)
    }catch(error){
      console.log(error);
      setErrors({message: 'Unable to fetch  questions, please try again'})
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchRoom();
      await fetchQuestions();
      setLoading(false);
    };

    fetchData();

    socket.emit("join-room", code);

    socket.on("new-question", (question) => {
      setQuestions((prev) => [question,...prev]);
    });

    //React calls this returned function when the component unmount either due to 
    //user closing the browser window or loosing the internet connection.
    //We'll use this to disconnect from new-question event.

    return () => {
      socket.off("new-question");
    }
  },[]);

  if(loading){
    return (
      <div className='conatiner text-center'>
        <p>Fetching room details</p>

      </div>
    );
  }

  if(errors.message){
    return (
      <div className='container text-center'>
        <p>{errors.message}</p>
      </div>
    );  
  }
  
  return (
    <div className='container py-5'>
        <h2>Room {code} created by {room.createdBy}</h2>
        <button className='btn btn-outline-success' onClick={fetchSummary}>
          Get Top Questions
        </button>
        <hr></hr>
        {
          summaries.length>0 && (
            <div className='mt-2'>
              <h5>Top Questions Asked</h5>
              <ul>
                {
                  summaries.map((sum,i)=>(
                    <li key={i}> {sum}</li>
                  ))
                }
              </ul>
            </div>
          )
        }
        <div className='row'>
          <div className='col-auto'>
            <ul className='list-group'>
              {questions.map((question)=>(
                <li key={question._id} className='list-group-items'>{question.content}</li>
              ))}

            </ul>
          </div>
        </div>
        <div className='row'>
          <Question roomCode={code}/>
        </div>
    </div>
  )
}

export default Room