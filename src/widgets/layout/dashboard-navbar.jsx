import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Typography,
  IconButton,
  Breadcrumbs,
  Menu,
  MenuHandler,
} from "@material-tailwind/react";
import { RiLogoutCircleLine } from "react-icons/ri";
import {
  useMaterialTailwindController,
} from "@/context";

export function DashboardNavbar() {
  const [controller] = useMaterialTailwindController();
  const { fixedNavbar } = controller;
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");

  // Función de logout
  const handleLogout = () => {
    console.log('hoal');

    // Elimina el token del localStorage
    localStorage.removeItem("token");

    // Redirecciona a la página principal "/"
    navigate("/");
  };

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${fixedNavbar
        ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
        : "px-0 py-1"
        }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${fixedNavbar ? "mt-1" : ""
              }`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
              {page}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color="blue-gray">
            {page}
          </Typography>
        </div>
        <div className="flex items-center">
          <Menu>
            <MenuHandler>
              <IconButton variant="text" color="blue-gray" >
                <button onClick={handleLogout}>
                  <RiLogoutCircleLine size={30} />
                </button>
              </IconButton>
            </MenuHandler>
          </Menu>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
