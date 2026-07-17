const Flashcard = require("../models/flashcard.js");
const Note = require("../models/note.js");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

// show all flashcard sets
module.exports.index = async (req, res) => {
    const allFlashcards = await Flashcard.find({}).populate("note");
    res.render("flashcards/index.ejs", { allFlashcards });
};

// show a specific flashcard set
module.exports.show = async (req, res) => {
    let { id } = req.params;
    const flashcard = await Flashcard.findById(id).populate("note");
    if (!flashcard) {
        req.flash("error", "Flashcard set not found!");
        return res.redirect("/flashcards");
    }
    res.render("flashcards/show.ejs", { flashcard });
};

// generate flashcards from a PDF using Groq API (free, works in India)
module.exports.generate = async (req, res) => {
    let { noteId } = req.params;
    const note = await Note.findById(noteId);

    if (!note) {
        req.flash("error", "PDF not found!");
        return res.redirect("/content");
    }

    // read the PDF file and extract text
    const filePath = path.join(__dirname, "..", "public", note.file.url);
    const fileBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(fileBuffer);
    const extractedText = pdfData.text.slice(0, 3000);

    // call the Groq API (free tier — no credit card needed, works in India)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: `You are a helpful study assistant. Based on the following text from a textbook, generate 8 flashcards for quick revision.

Return ONLY a valid JSON array in this exact format, with no extra text, no markdown, no backticks:
[
  { "question": "...", "answer": "..." },
  { "question": "...", "answer": "..." }
]

Text:
${extractedText}`
                }
            ],
            temperature: 0.7,
        }),
    });

    const data = await response.json();

    // log response for debugging
    console.log("Groq response:", JSON.stringify(data, null, 2));

    // check if Groq returned an error
    if (data.error) {
        req.flash("error", `Groq API error: ${data.error.message}`);
        return res.redirect("/content");
    }

    // Groq follows OpenAI format — response is in choices[0].message.content
    const rawText = data.choices[0].message.content;

    // strip any accidental markdown backticks, then parse
    const cleanText = rawText.replace(/```json|```/g, "").trim();
    const cards = JSON.parse(cleanText);

    // save the flashcard set to DB
    const flashcard = new Flashcard({
        note: note._id,
        cards,
    });
    await flashcard.save();

    req.flash("success", "Flashcards generated successfully!");
    res.redirect(`/flashcards/${flashcard._id}`);
};

// delete a flashcard set
module.exports.destroyFlashcard = async (req, res) => {
    let { id } = req.params;
    await Flashcard.findByIdAndDelete(id);
    req.flash("success", "Flashcard set deleted!");
    res.redirect("/flashcards");
};