import OpenAI from "openai";
import { Report } from "../model/report.model.js";
import fs from "fs";
import Tesseract from "tesseract.js";
import { createRequire } from "module";
import path from "path";

const require = createRequire(import.meta.url);
const pdfPoppler = require("pdf-poppler");

// 🔥 OpenAI (Groq)
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// ✅ Upload report
console.log("Upload controller hit");
export const uploadReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const report = await Report.create({
      user: req.user._id,
      fileName: req.file.originalname,
      filePath: req.file.path, // 🔥 automatic path
      status: "uploaded",
    });

    res.status(201).json({
      message: "File uploaded successfully",
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

// ✅ Process report (FIXED)
console.log("process controller hit");
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

    // 🔥 Step 1: Convert PDF → Image
    const outputDir = "uploads/output";

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const options = {
      format: "png",
      out_dir: outputDir,
      out_prefix: "page",
      page: 1,
    };

    await pdfPoppler.convert(report.filePath, options);

    const imagePath = path.join(outputDir, "page-1.png");

    console.log("Image created at:", imagePath);

    // 🔥 Step 2: OCR
    const result = await Tesseract.recognize(imagePath, "eng", {
      logger: (m) => console.log(m),
    });

    const extractedText = result.data.text;

    console.log("==== OCR TEXT ====");
    console.log(extractedText);
    const cleanedText = extractedText
  .replace(/\n+/g, " ")
  .replace(/\s+/g, " ")
  .trim();

    // 🔥 Step 3: AI
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
${cleanedText}`,
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

    // 🔥 Step 4: Save
    report.extractedText = extractedText;
    report.summary = parsed.summary;
    report.conditionsDetected = parsed.conditions;
    report.status = "completed";

    await report.save();

    res.json({
      message: "Report processed",
      report,
    });

    console.log("==== AI RESPONSE ====");
    console.log(content);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};