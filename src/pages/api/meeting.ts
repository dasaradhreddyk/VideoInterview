import { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = "fb880bc345b5197637c8";
const ORG_ID = "6624c0e4-88e9-46d2-89f2-747c935f927d";

console.log( "api keys "+ API_KEY);
const BASIC_TOKEN = Buffer.from(ORG_ID + ':' + API_KEY).toString('base64');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ success: false, message: 'Method Not Allowed' });
  }

  const { name, email } = req.body;

  const meetingResponse = await fetch(
    'https://api.dyte.io/v2/meetings',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + BASIC_TOKEN,
      },
      body: JSON.stringify({ title: 'Interview with ' + name }),
    }
  );

  const meetingData = await meetingResponse.json();

  if (!meetingResponse.ok) {
    return res.status(meetingResponse.status).json(meetingData);
  }

  const { id } = meetingData.data;

  const participantResponse = await fetch(
    `https://api.cluster.dyte.in/v2/meetings/${id}/participants`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
       Authorization: 'Basic ' + BASIC_TOKEN,
      },
      body: JSON.stringify({
        name,
        preset_name: 'group_call_host',
        custom_participant_id: email,
      }),
    }
  );

  res.status(participantResponse.status).json(await participantResponse.json());
}
