//Auth token we will use to generate a meeting and connect to it
export const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJmYjI1OWE5Ny01ZGE2LTQyYTItODI4Ny0wNTFiZDg5MTliYjMiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcwNDMwNTcyMCwiZXhwIjoxODYyMDkzNzIwfQ.BAidX_PZElstYnLjma7I0BDoieVEIENzTel99ArRIl8";
// API call to create meeting
export const createMeeting = async ({ token, customId }) => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({"customId" : customId}),
  });
  //Destructuring the roomId from the response
  const { roomId } = await res.json();
  return roomId;
};