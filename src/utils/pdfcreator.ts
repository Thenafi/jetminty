import { reject } from "lodash";
import { resolve } from "path";

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

const updateData = async function (fileID: string, data: any) {
  const requests = [];

  for (const key in data) {
    requests.push({
      replaceAllText: {
        containsText: {
          text: `{{${key}}}`,
          matchCase: true,
        },
        replaceText: data[key],
      },
    });
  }

  const authClient = await authorize();
  const docs = google.docs({ version: "v1", auth: authClient });
  const res = await docs.documents.batchUpdate({
    documentId: fileID,
    resource: { requests: requests },
  });
  return res;
};

const exportPDF = async function (fileID: string, fileName: string) {
  const authClient = await authorize();
  const drive = google.drive({ version: "v3", auth: authClient });

  const destPath = path.join(os.tmpdir(), "temp.pdf");
  const dest = fs.createWriteStream(destPath);
  const res = await drive.files.export(
    { fileId: fileID, mimeType: "application/pdf" },
    { responseType: "stream" }
  );
  // console.log(res.data);
  try {
    await new Promise((resolve, reject) => {
      res.data
        .on("end", () => {
          fs.readFile(destPath, async (err: any, data: any) => {
            if (err) {
              reject(err);
              throw err
            };
            bucketParamsDoremon.Key = "magic_pocket/" + fileName + ".pdf";
            bucketParamsDoremon.Body = data;
            await s3ClientTebi.send(new PutObjectCommand(bucketParamsDoremon));
            resolve("File uploaded successfully");
          });
        })
        .on("error", (err: any) => {
          console.error("Error downloading document.");
          reject(err);
        })
        .pipe(dest);
    });
    return {
      status: 200,
      googleDocUlr: "https://docs.google.com/document/d/" + fileID,
      pdfUrl: "https://s3.tebi.io/doremon/magic_pocket/" + fileName + ".pdf",
    };
  } catch (err) {
    console.log(err);
    return {
      status: 500,
    };
  }
};

const pdfCreator = async function (
  data: any,
  fileID: string,
  fileName: string
) {
  const copyData = await copyFile(fileID, fileName);
  if (copyData.status === 200) {
    // console.log("File copied successfully");
    const updateDataRes = await updateData(copyData.data.id, data);
    // console.log(updateDataRes)
    if (updateDataRes.status === 200) {
      const exportedPdfRes = await exportPDF(
        updateDataRes.data.documentId,
        fileName
      );
      if (exportedPdfRes.status === 200) {
        console.log("Process completed successfully");
        return exportedPdfRes;
      } else {
        new Error("File not exported");
      }
    } else {
      new Error("File not updated");
    }
  } else {
    new Error("File not copied");
  }
};

pdfCreator(
  { student_name: "Ola" },
  "11qhe5jHiKJ1ZvXbtx32NtgiqHHRP-GANXZlLGj3OUQc",
  "Test"
).then((res) => {
  console.log(res);
});

module.exports = { pdfCreator };
