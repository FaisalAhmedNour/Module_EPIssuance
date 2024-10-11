import { createMemoryRouter } from "react-router-dom";
import Main from "../Layouts/Main/Main";
import EPIssuance from "../pages/EPIssuance/EPIssuance";

export const router = createMemoryRouter([
    {
        path: "/",
        element:<Main />,
        // errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <EPIssuance />
            },
        ]
    }
]);