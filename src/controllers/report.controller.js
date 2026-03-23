import OpenAI from "openai";
import { Report } from "../model/report.model.js";
import fs from "fs";
//import { createRequire } from "module";

/*
const require = createRequire(import.meta.url);
const pdfParseLib = require("pdf-parse");
const pdfParse = require("pdf-parse/lib/pdf-parse.js");
*/

// 🔥 OpenAI (Groq)
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// ✅ Upload report
export const uploadReport = async (req, res) => {
  try {
    const { fileName, filePath } = req.body;

    const report = await Report.create({
      user: req.user._id,
      fileName,
      filePath,
      status: "uploaded",
    });

    res.status(201).json({
      message: "Report uploaded successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ Get user reports
export const getUserReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user._id });

    res.json({ reports });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ Process report
export const processReport = async (req, res) => {
  try {
    const { reportId } = req.body;

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    if (!report.filePath) {
      return res.status(400).json({
        message: "File path missing",
      });
    }

    console.log("REPORT DATA:", report);

    // 🔥 Step 1: Extract PDF text
    const dataBuffer = fs.readFileSync(report.filePath);

    const pdfData = await pdfParse(dataBuffer);

    const extractedText = pdfData.text;

    console.log("==== EXTRACTED TEXT ====");
    console.log(extractedText);

    // 🔥 Step 2: Set processing
    report.status = "processing";
    await report.save();

    // 🔥 Step 3: AI call
    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `You are a medical assistant.

Analyze the report and return STRICT JSON:

{
  "summary": "simple explanation",
  "conditions": ["condition1", "condition2"]
}

Text:
${extractedText}`,
        },
      ],
    });

    const content = response.choices[0].message.content;

    let parsed;

    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = {
        summary: content,
        conditions: [],
      };
    }

    // 🔥 Step 4: Save results
    report.extractedText = extractedText;
    report.summary = parsed.summary;
    report.conditionsDetected = parsed.conditions;
    report.status = "completed";

    await report.save();

    res.json({
      message: "Report processed",
      report,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};