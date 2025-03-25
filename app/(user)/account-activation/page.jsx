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

	const cook = await cookies()
	console.log(cook.get('userId')?.value);
	
	const userId = cook.get('userId')?.value || null
	const accessToken = cook.get('accessToken')?.value || null
	const user = await getUserDetails(userId, accessToken).catch((err) =>  null)
	
	
	return (
		
		<>
			<CheckEmailPage userDetails={user} userId={userId} accessToken={accessToken}/>
		</>
	)
}