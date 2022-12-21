import Mailjet, { SendEmailV3_1 } from 'node-mailjet'

const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    apiSecret: process.env.MJ_APIKEY_PRIVATE
});

export const sendMail = async (emailList: string[], Subject: string, HTMLPart: string, TextPart: string) => {
    const emailListForMailjet = emailList.map((email) => ({ Email: email }));

    const data: any = {
        Messages: [
            {
                From: {
                    Email: 'niternotebot@gmail.com',
                    Name: "NITER NOTEBOT"
                },
                To: emailListForMailjet,

                Subject: Subject,
                HTMLPart: HTMLPart,
                TextPart: TextPart
            },
        ],
    };

    const result = await mailjet
        .post('send', { version: 'v3.1' })
        .request(data);

    const { Status } = result.body.Messages[0];
    return Status;
};


export const sendCoverGeneratedLinks = async (emailList: string[], googleDocLink: string, pdfLink: string) => {
    const HTMLPart = `<p><b>Thank You for using NITER NOTEBOT cover generator.</b></p>
    <p><a href="${googleDocLink}">Google Doc Link</a><p>
    <a href="${pdfLink}">PDF Link</a>
    <p><i>PDF Links are auto deleted after 30 days</i></p>`

    const TextPart = `Thank You for using NITER NOTEBOT cover generator.

    Google Doc Link
    
    PDF Link
    
    PDF Links are auto deleted after 30 days`
    console.log(emailList)

    try {
        const status = await sendMail(emailList, "Your cover page is here 🎉", HTMLPart, TextPart);
        return status;
    } catch (error) {
        console.log(error);
        return new Error("Failed to send mail");
    }
};
