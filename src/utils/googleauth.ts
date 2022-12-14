const { google } = require("googleapis");
const fs = require("fs");
const os = require("os");
const path = require("path");
const dotenv = require("dotenv");
const {
  s3ClientTebi,
  bucketParamsDoremon,
  PutObjectCommand,
} = require("./buckets");

dotenv.config();

const authorize = async function () {
  const credentials = {
    type: process.env.TYPE,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    refresh_token: process.env.REFRESH_TOKEN,
  };
  return google.auth.fromJSON(credentials);
};

const copyFile = async function (copyFileID: string, fileName: string) {
  const copyRequest = {
    name: fileName,
    parents: ["1jR-ikAAMmiWh-7vKCproajPGevf1M1Px"],
  };
  const authClient = await authorize();
  const drive = google.drive({ version: "v3", auth: authClient });
  const res = await drive.files.copy({
    fileId: copyFileID,
    requestBody: copyRequest,
  });
  return res;
};

const updateData = async function (fileID: string, data: { name: string }) {
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
  const authClient = await authorize();
  const docs = google.docs({ version: "v1", auth: authClient });
  const res = await docs.documents.batchUpdate({
    documentId: fileID,
    resource: { requests: requests },
  });
  return res;
};

const exportPDF = async function (fileID: string) {
  const authClient = await authorize();
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
          bucketParamsDoremon.Key = "magic_pocket/Random32.pdf";
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
};

authorize()
  .then(async () => {
    const copyData = await copyFile(
      "11qhe5jHiKJ1ZvXbtx32NtgiqHHRP-GANXZlLGj3OUQc",
      "Random Name"
    );
    if (copyData.status === 200) {
      console.log("File copied successfully");
      const updateDataRes = await updateData(copyData.data.id, {
        name: "tes3t 12",
      });
      // console.log(updateDataRes)
      if (updateDataRes.status === 200) {
        await exportPDF(updateDataRes.data.documentId);
      }
    } else {
      new Error("File not copied");
    }
  })
  .catch(console.error);
