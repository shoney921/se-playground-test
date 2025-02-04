import { useSearchParams } from "react-router-dom";

const ListPage: React.FC = () => {
    const [searchParams] = useSearchParams();

    const page: number = Number(searchParams.get("page")) || 1;
    const size: number = Number(searchParams.get("size")) || 10;

    return (
        <div className="todo-list-page">
            Todo List Component {page} - {size}
        </div>
    )
}

export default ListPage;