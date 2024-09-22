const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors()); 
app.use(bodyParser.json({ limit: "10mb" })); 

const processInputData = (data) => {
  let numericValues = [],
    alphabeticValues = [],
    lowestLowercase = null;

  data.forEach((item) => {
    if (!isNaN(item)) numericValues.push(item);
    else if (/^[a-zA-Z]$/.test(item)) {
      alphabeticValues.push(item);
      if (
        item === item.toLowerCase() &&
        (!lowestLowercase || item > lowestLowercase)
      ) {
        lowestLowercase = item;
      }
    }
  });

  return { numericValues, alphabeticValues, lowestLowercase };
};

app.post("/bfhl", (req, res) => {
  const { data, file_b64 } = req.body;
  if (!data || !Array.isArray(data))
    return res
      .status(400)
      .json({ is_success: false, message: "Invalid input" });

  const { numericValues, alphabeticValues, lowestLowercase } = processInputData(data);

  let fileInfo = {
    is_file_valid: false,
    mime_type: null,
    size_in_kb: null,
  };

  if (file_b64) {
    try {
      const fileBuffer = Buffer.from(file_b64, "base64");
      fileInfo = {
        is_file_valid: true,
        mime_type:
          fileBuffer[0] === 0x89 && fileBuffer[1] === 0x50
            ? "image/png"
            : "application/octet-stream",
        size_in_kb: (fileBuffer.length / 1024).toFixed(2),
      };
    } catch (err) {
      fileInfo.is_file_valid = false;
    }
  }

  res.json({
    is_success: true,
    user_id: "SAKSHAM BOTKE",
    email: "sa9607@srmist.edu.in",
    roll_number: "RA2111008020027",
    numeric_values: numericValues,
    alphabetic_values: alphabeticValues,
    lowest_lowercase_alphabet: lowestLowercase ? [lowestLowercase] : [],
    ...fileInfo,
  });
});

app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
