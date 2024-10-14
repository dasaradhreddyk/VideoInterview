import { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    let userid = "dasradhreddyk";
    let application = "videoexams";
    let filename = "questions";
    let questionsValue ={};
    let questions = await fetch(
        'https://talashvideo.azurewebsites.net/dyte/GetpQuestionsVideolist?userid=dasaradhreddyk&applicaiton=app&filename=questions'

    ).then(async response => {
        const data = await response.json();
        //console.log("api", data)

        // check for error response
        if (!response.ok) {
            // get error message from body or default to response statusText
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        
       
        questionsValue = data;
        
        //console.log("api questionsValue", questionsValue)

    })
        .catch(error => {
            // this.setState({ errorMessage: error.toString() });
       //     console.error('There was an error!', error);
        });

    res.json(questionsValue);

}