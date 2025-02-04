import { lazy, Suspense } from "react";

const Loading = <div>Loading...</div>;
const IDEPage = lazy(() => import("../pages/practice/IDEPage"));

const practiceRouter = [
    {
        path: "ide",
        element: (
            <Suspense fallback={Loading}>
                <IDEPage />
            </Suspense>
        ),
    },
];

export default practiceRouter;
