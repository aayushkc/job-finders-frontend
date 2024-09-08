import { APIENDPOINT } from "@/app/api/APIENDPOINT";
import { cookies } from "next/headers";
import CheckEmailPage from "./components";

async function getUserDetails(id, accessToken) {

	const userResponse = await fetch(`${APIENDPOINT}/get-user-details/${id}`, {
		method: "GET",
		headers: {
			AUTHORIZATION: `Bearer ${accessToken}`
		},
		cache:"no-store"
	})

	const user = await userResponse.json()
	return user
}
export default async function AccountActivation() {
	const userId = cookies().get('userId')?.value || null
	const accessToken = cookies().get('accessToken')?.value || null
	const user = await getUserDetails(userId, accessToken).catch((err) => null)
	return (
		<>
			<CheckEmailPage userDetails={user} userId={userId} accessToken={accessToken}/>
		</>
	)
}