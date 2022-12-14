const { google } = require("googleapis");
const fs = require("fs");
const os = require("os");
const path = require("path");
const dotenv = require("dotenv");
const { s3ClientTebi, bucketParamsDoremon, PutObjectCommand } = require("../../utils/buckets");

dotenv.config();

async function loadCredentials() {
  const credentials = {
    type: process.env.TYPE,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    refresh_token: process.env.REFRESH_TOKEN,
  };
  return google.auth.fromJSON(credentials);
}

async function authorize() {
  return await loadCredentials();
}

async function copyFile(authClient: any, copyFileID: string) {
  const date = new Date();
  const options: any = { year: "numeric", month: "long", day: "numeric" };
  const copyRequest = {
    // Modified
    name: `${date.toLocaleDateString("en-US", options)}`,
    parents: ["1jR-ikAAMmiWh-7vKCproajPGevf1M1Px"],
  };

  const drive = google.drive({ version: "v3", auth: authClient });
  const res = await drive.files.copy({
    fileId: copyFileID,
    requestBody: copyRequest,
  });
  return res;
}

async function updateData(
  authClient: any,
  fileID: string,
  data: { name: string }
) {
  const requests = [
    {
      replaceAllText: {
        containsText: {
          text: "{{name}}",
          matchCase: true,
        },
        replaceText: data.name,
      },
    },
    {
      replaceAllText: {
        containsText: {
          text: "{{type_of_subject}}",
          matchCase: true,
        },
        replaceText: "Assignment",
      },
    },
  ];

  const docs = google.docs({ version: "v1", auth: authClient });
  const res = await docs.documents.batchUpdate({
    documentId: fileID,
    resource: { requests: requests },
  });
  return res;
}

async function exportPDF(authClient: any, fileID: string) {
  const drive = google.drive({ version: "v3", auth: authClient });

  const destPath = path.join(os.tmpdir(), "temp.pdf");
  const dest = fs.createWriteStream(destPath);
  const res = await drive.files.export(
    { fileId: fileID, mimeType: "application/pdf" },
    { responseType: "stream" }
  );


  res.data
    .on("end", () => {
      console.log(`Done downloading document: ${destPath}.`);
      try {
        fs.readFile(destPath, (err: any, data: any) => {
          bucketParamsDoremon.Key = "creation/Random32.pdf";
          bucketParamsDoremon.Body = data;

          s3ClientTebi
            .send(new PutObjectCommand(bucketParamsDoremon))
            .then((data: any) => {
              console.log("Done", data);
            });
        });
      } catch (err) {
        console.log("Error", err);
      }
    })
    .on("error", (err: any) => {
      console.error("Error downloading document.");
    })
    .pipe(dest);
}

authorize()
  .then(async (authData) => {
    const copyData = await copyFile(
      authData,
      "11qhe5jHiKJ1ZvXbtx32NtgiqHHRP-GANXZlLGj3OUQc"
    );
    if (copyData.status === 200) {
      console.log("File copied successfully");
      const updateDataRes = await updateData(authData, copyData.data.id, {
        name: "tes3t 12",
      });
      // console.log(updateDataRes)
      if (updateDataRes.status === 200) {
        await exportPDF(authData, updateDataRes.data.documentId);
      }
    } else {
      new Error("File not copied");
    }
  })
  .catch(console.error);
