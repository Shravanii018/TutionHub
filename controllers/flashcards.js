const Flashcard = require("../models/flashcard.js");
const Note = require("../models/note.js");
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

// generate flashcards from a PDF using Groq API
module.exports.generate = async (req, res) => {
    let { noteId } = req.params;
    const note = await Note.findById(noteId);

    if (!note) {
        req.flash("error", "PDF not found!");
        return res.redirect("/content");
    }

    if (!note.file || !note.file.url) {
        req.flash("error", "No file attached to this note!");
        return res.redirect("/content");
    }

    // download PDF from Cloudinary URL instead of reading from disk
    const response = await fetch(note.file.url);
    if (!response.ok) {
        req.flash("error", "Could not download the PDF file!");
        return res.redirect("/content");
    }
    const arrayBuffer = await response.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // extract text from PDF buffer
    const pdfData = await pdfParse(fileBuffer);
    const extractedText = pdfData.text.slice(0, 3000);

    // call the Groq API
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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

    const data = await groqResponse.json();

    if (data.error) {
        req.flash("error", `Groq API error: ${data.error.message}`);
        return res.redirect("/content");
    }

    const rawText = data.choices[0].message.content;
    const cleanText = rawText.replace(/```json|```/g, "").trim();
    const cards = JSON.parse(cleanText);

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