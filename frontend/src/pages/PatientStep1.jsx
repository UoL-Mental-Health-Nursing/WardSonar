import { useNavigate } from 'react-router-dom'

function PatientStep2(){
    const navigate = useNavigate()
    return(
        <div>
            <h2> How does the ward atmosphere feel right now? </h2>
            <button onClick={() => navigate('/patient/step2')}>Next</button>
        </div>
    )
}

export default PatientStep1