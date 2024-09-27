import authenticationRoutes from "./authentication.routes";

const routes = [{ ...authenticationRoutes }];

function getAllRoutes() {
	return routes;
}

export { getAllRoutes };
