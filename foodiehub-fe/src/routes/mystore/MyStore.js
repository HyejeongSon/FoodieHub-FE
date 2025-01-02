import { useNavigate } from "react-router-dom";


function MyStore() {
    const navigate = useNavigate();

    return (
        <div>
            <h1>내 식당 페이지 !!!</h1>
            <button
                className="updatebutton"
                type="button"
                onClick={() => navigate("/store_register")}
            >
                사장님 가게 등록
            </button>
        
        </div>

        
    );
}

export default MyStore;