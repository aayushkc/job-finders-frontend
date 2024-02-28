import { APIENDPOINT } from "./APIENDPOINT";
export default async function GetRequestNoToken (endpoint) {
    try {
        const response = await fetch(`${APIENDPOINT}${endpoint}`, {
            method: "GET"
        })
        if (!response.ok) {
            return response.json()
        }
        return response.json()
    }
    catch (error) {
        throw  new Error("Failed to fetch")
    }
}