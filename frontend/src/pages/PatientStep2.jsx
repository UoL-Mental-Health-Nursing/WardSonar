import { useNavigate } from 'react-router-dom'

function PatientStep2(){
    const navigate = useNavigate()
    return(
        <div>
            <h2>Which direction is it going?</h2>
            <button onClick={() => navigate('/patient/step3')}>Next</button>
        </div>
    )
}

export default PatientStep2