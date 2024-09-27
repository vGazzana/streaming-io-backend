import authenticationRoutes from "./authentication.routes";

const routes = [{ ...authenticationRoutes }];

function getAllRoutes() {
	return routes;
}

function getAllPublicRoutes() {
	return getAllRoutes().flatMap((route) => route.public);
}

export { getAllRoutes, getAllPublicRoutes };
