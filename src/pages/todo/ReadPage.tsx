import { useParams, useNavigate, useSearchParams } from "react-router-dom";

const ReadPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [queryParams, setQueryParams] = useSearchParams();

    const moveToModifyPage = (): void => {
        setQueryParams({ page: queryParams.get("page") || "1", size: queryParams.get("size") || "10" });
        navigate(`/todo/modify/${id}`);
    }

    return (
        <div className="todo-read-page">
            <div> Read Page {id} </div>
            <button onClick={moveToModifyPage}>Modify</button>
        </div>
    )
}

export default ReadPage; 