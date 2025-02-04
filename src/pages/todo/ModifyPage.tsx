import { useParams } from "react-router-dom";

const ModifyPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    return (
        <div className="todo-modify-page">
            Modify Page {id}
        </div>
    )
}

export default ModifyPage;