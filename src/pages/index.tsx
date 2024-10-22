import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent, useCallback, useReducer, useState } from 'react';

interface Form {
  name: string;
  email: string;
}

export default function Home() {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useReducer(
    (state: Form, payload: Partial<Form>) => {
      return { ...state, ...payload };
    },
    { name: '', email: '' }
  );

  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (form.email.trim() === '' || form.name.trim() === '') {
        return;
      }

      setSubmitting(true);

      try {

        // const res = await fetch('/api/meeting', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(form),
        // });

        const API_KEY = "fb880bc345b5197637c8";
        const ORG_ID = "6624c0e4-88e9-46d2-89f2-747c935f927d";

        console.log("api keys " + API_KEY);
        const BASIC_TOKEN = Buffer.from(ORG_ID + ':' + API_KEY).toString('base64');

        const meetingResponse = await fetch(
          'https://api.dyte.io/v2/meetings',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Basic ' + BASIC_TOKEN,
            },
            body: JSON.stringify({ title: 'Interview with ' + form.email, preferred_region: "ap-south-1", record_on_start: false, }),
          }
        );
        console.log(meetingResponse.json);

        const meetingData = await meetingResponse.json();

        // if (!meetingResponse.ok) {
        //   console.log("first error")
        //   return res.status(meetingResponse.status).json(meetingData);
        // }

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
              name:form.name,
              preset_name: 'group_call_host',
              picture :  "https://i.imgur.com/test.jpg",
              custom_participant_id: form.email,
            }),
          }
        );

        let response  = await participantResponse.json();
        console.log("apiKey " + JSON.stringify(response.data.token));

        const { token1 } = response.data;
        console.log("token" + token1);


       // const { token } = { "token": 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdJZCI6IjY2MjRjMGU0LTg4ZTktNDZkMi04OWYyLTc0N2M5MzVmOTI3ZCIsIm1lZXRpbmdJZCI6ImJiYjdlMTQyLTY2NTgtNDA0Ny04MTM3LTczMTAxMmI1MTg1YiIsInBhcnRpY2lwYW50SWQiOiJhYWE5MGM2YS00NDkyLTRmODktYTc1Zi01NWVmZThmZDFjMzciLCJwcmVzZXRJZCI6ImYzYjBjZTMxLTZmNjAtNDY4Yy04MjkzLTMyM2M1M2Y2MjkzZiIsImlhdCI6MTcyODQ3NzMzMSwiZXhwIjoxNzM3MTE3MzMxfQ.Pegw76BDg2KB5vuF1nSmtUNcphQx9RhH219iTMUr5lC-USslAuiD0SrH-RTwYBgIq5et7zzSaXODZ7tpJ-qVDb-S3qi1MbA3imyjFUBzfvPdoqRbLMFTVDsKrcdWPTxDXLsvVcb_D7LTsOp8iav68GCAYtyfG66csv11Aj1FWdP1EQjBSgcPdqxBeW2tN0L_qbxMk5B53E73pqQMFTwrYHQPQLsly3BdYxuY0wbROp7izV35c4iUZ5Sh1sQktyk_gha91nCpjiitJKZAiLQuBGKQTP_jV7T2Fp3Wqc-Rgl_cRJ8KVOfAtWY1NWskRcxMukGp2OTKeXgzETciXXaVbg' };
       const { token } = { "token": response.data.token}
        router.push({
          pathname: '/interview',
          query: {
            token,
          },
        });
      } finally {
        setSubmitting(false);
      }
    },
    [form, router]
  );

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6">
      <Head>
        <title>Async Interview Sample - Dyte</title>
      </Head>
      <div className="flex w-full max-w-screen-md flex-col items-center justify-center gap-3 text-center">
        <h1 className="text-3xl font-bold text-blue-600">
          Async Video Interview
        </h1>

        <form
          className="mt-4 flex w-full max-w-sm flex-col gap-3"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onInput={(e) => setForm({ name: e.currentTarget.value })}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onInput={(e) => setForm({ email: e.currentTarget.value })}
            required
          />

          <button
            className="h-10 rounded-md bg-blue-600 font-semibold text-white"
            disabled={submitting}
          >
            {submitting ? 'Starting...' : 'Start'}
          </button>
        </form>
      </div>
    </div>
  );
}
