import { createSigner, createVerifier } from "fast-jwt";

const secret = process.env.JWT_SECRET_KEY ?? "abracadabra";
function signInPayload(payload: { [key: string]: string }) {
	const signer = createSigner({ key: secret, algorithm: "HS256" });
	return signer(payload);
}

const validateToken = (token: string) => {
	const verifier = createVerifier({ key: secret, algorithms: ["HS256"] });

	try {
		const payload = verifier(token);
		return {
			valid: true,
			payload,
		};
	} catch (error) {
		if (error instanceof Error) throw new Error(error.message);
		throw new Error("An unexpected error occurred while verifying token");
	}
};

export { signInPayload, validateToken };
