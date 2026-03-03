import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import ErrorPage from "../Shared/ErrorPage";
import ForgotPassword from "../auth/ForgotPassword";
import Login from "../auth/Login";
import NewPassword from "../auth/NewPassword";
import OTPVerifyPage from "../auth/OTPVerifyPage";
import AdminManage from "../dashboard/Admin/Admins";

import Dashboard from "../dashboard/Dashboard/Dashboard";

import Users from "../dashboard/Users/Users";

import AdminIndividualChat from "../dashboard/AdminIndividualChat/AdminIndividualChat";
import { AdminRequestDetails } from "../dashboard/AdminRequestDetails/AdminRequestDetails";
import AdminStockDetails from "../dashboard/AdminStockDetails/AdminStockDetails";
import Approvals from "../dashboard/Approvals/Approvals";
import Requests from "../dashboard/Requests/Requests";
import Stocks from "../dashboard/Stocks/Stocks";
import Billing from "../dashboard/Billing/Billing";
import InvestorBrief from "../dashboard/InvestorBrief/InvestorBrief";
import CMS from "../dashboard/CMS/CMS";
import Settings from "../dashboard/Setting/Setting";
import Notifications from "../dashboard/Notifications/Notifications";
import PrivateRoute from "./PrivateRouter";

const router = createBrowserRouter([
    {
        path: "/",
        element: <PrivateRoute> <MainLayout /></PrivateRoute>,
        // element: <MainLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Dashboard />
            },

            {
                path: "users",
                element: <Users />
            },
            {
                path: "admins",
                element: <AdminManage />
            },
            {
                path: "approvals",
                element: <Approvals />
            },
            {
                path: "approvals/requests/:id",
                element: <AdminRequestDetails />
            },
            {
                path: "approvals/stock/:id",
                element: <AdminStockDetails />
            },
            {
                path: "requests",
                element: <Requests />
            },
            {
                path: "requests/:id",
                element: <AdminRequestDetails />
            },
            {
                path: "requests/:requestId/chat/:chatId",
                element: <AdminIndividualChat />
            },
            {
                path: "stocks",
                element: <Stocks />
            },
            {
                path: "stocks/:id",
                element: <AdminStockDetails />
            },
            {
                path: "billing",
                element: <Billing />
            },
            {
                path: "investor-brief",
                element: <InvestorBrief />
            },
            {
                path: "cms",
                element: <CMS />
            },
            {
                path: "settings",
                element: <Settings />
            },
            {
                path: "notifications",
                element: <Notifications />
            },
        ]
    },
    { path: "/login", element: <Login /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/otp-verify", element: <OTPVerifyPage /> },
    { path: "/new-password", element: <NewPassword /> },
])

export default router;