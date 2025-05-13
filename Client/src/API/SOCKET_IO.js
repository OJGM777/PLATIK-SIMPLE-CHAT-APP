import io from "socket.io-client";

const ENDPOINT = "http://localhost:3000"; // Define the server endpoint
export const socket = io(ENDPOINT);