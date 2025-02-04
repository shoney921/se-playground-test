import { Suspense, lazy } from "react";
import todoRouter from "./todoRouter";
import practiceRouter from "./practiceRouter";
import { createBrowserRouter, RouteObject } from "react-router-dom";

const Loading: React.FC = () => <div>Loading...</div>;
const MainPage = lazy(() => import("../pages/MainPage"));
const TodoIndexPage = lazy(() => import("../pages/todo/IndexPage"));
const PracticeIndexPage = lazy(() => import("../pages/practice/IndexPage"));

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Suspense fallback={<Loading />}>
                <MainPage />
            </Suspense>
        ),
    },
    {
        path: "practice",
        element: (
            <Suspense fallback={<Loading />}>
                <PracticeIndexPage />
            </Suspense>
        ),
        children: practiceRouter,
    },
    {
        path: "todo",
        element: (
            <Suspense fallback={<Loading />}>
                <TodoIndexPage />
            </Suspense>
        ),
        children: todoRouter,
    },
] as RouteObject[]);

export default router;
