# TuitionHub

A full-stack tuition management platform that helps private teachers manage students, attendance, fees, and study materials — with AI-powered flashcard generation from uploaded PDFs.

> Built with Node.js, Express, MongoDB, and EJS. Actively used by a real tuition teacher and her students.

🔗 **[Live Demo](https://tutionhub-4r2v.onrender.com)** &nbsp;|&nbsp; 👩‍💻 **[Portfolio](#)** &nbsp;|&nbsp; 💼 **[LinkedIn](https://www.linkedin.com/in/shravani-jagtap-175751318/)**

---

## Features

**Teacher**
- Role-based dashboard to manage students, attendance, and fees
- Upload notes, PDFs, and assignments for students
- Post announcements and track fee payments
- Generate AI flashcards from any uploaded PDF (Groq API)

**Student**
- View announcements, notes, and study materials
- Study with interactive AI-generated flashcards
- Track personal attendance and fee status

---

## Tech Stack

`Node.js` `Express.js` `MongoDB` `Mongoose` `EJS` `Bootstrap 5` `Passport.js` `Multer` `Groq API` `Joi`

**Architecture:** MVC &nbsp;|&nbsp; **Auth:** Sessions + Passport &nbsp;|&nbsp; **AI:** Groq (llama-3.3-70b-versatile)

---

## Getting Started

```bash
git clone https://github.com/yourusername/tuitionhub.git
cd tuitionhub
npm install
```

Create a `.env` file:
```
GROQ_API_KEY=your_groq_api_key
SECRET=your_session_secret
```

```bash
mongod                  # start MongoDB
node init/index.js      # seed database
node app.js             # start server → http://localhost:3000
```

**Demo login:** &nbsp; Teacher → `teacher / teacher123` &nbsp;|&nbsp; Student → `rahul_sharma / student123`

---

## Security Highlights

- Students cannot self-assign the teacher role — teacher account is created only via seed script
- Server-side Joi validation on all forms
- `httpOnly` session cookies
- Custom error handling with `ExpressError` and `wrapAsync`

---

## Author

**Shravani Jagtap** — Computer Engineering Student, Pune  
[GitHub](https://github.com/Shravanii018) &nbsp;|&nbsp; [LinkedIn](https://www.linkedin.com/in/shravani-jagtap-175751318/)