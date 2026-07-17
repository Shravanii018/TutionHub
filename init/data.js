const sampleStudents = [
    {
        username: "rahul_sharma",
        fullName: "Rahul Sharma",
        email: "rahul@example.com",
        phone: "9876543210",
        role: "student",
    },
    {
        username: "priya_patel",
        fullName: "Priya Patel",
        email: "priya@example.com",
        phone: "9876543211",
        role: "student",
    },
    {
        username: "arjun_mehta",
        fullName: "Arjun Mehta",
        email: "arjun@example.com",
        phone: "9876543212",
        role: "student",
    },
    {
        username: "sneha_joshi",
        fullName: "Sneha Joshi",
        email: "sneha@example.com",
        phone: "9876543213",
        role: "student",
    },
    {
        username: "rohan_desai",
        fullName: "Rohan Desai",
        email: "rohan@example.com",
        phone: "9876543214",
        role: "student",
    },
];

const sampleAnnouncements = [
    {
        title: "Unit Test Next Week",
        message: "Unit test for Mathematics and Science will be held next Monday. Please revise chapters 3 and 4.",
    },
    {
        title: "Holiday on Friday",
        message: "There will be no class this Friday due to a local holiday. Classes resume Saturday morning.",
    },
    {
        title: "Fee Reminder",
        message: "Kindly submit this month's tuition fees before the 10th. Late submissions will attract a fine.",
    },
];

const sampleNotes = [
    {
        title: "Algebra Basics",
        subject: "Mathematics",
        type: "note",
        file: {
            filename: "algebra_basics.pdf",
            url: "/uploads/algebra_basics.pdf",
        },
    },
    {
        title: "Newton's Laws of Motion",
        subject: "Science",
        type: "pdf",
        file: {
            filename: "newtons_laws.pdf",
            url: "/uploads/newtons_laws.pdf",
        },
    },
    {
        title: "Chapter 5 Assignment",
        subject: "Mathematics",
        type: "assignment",
        file: {
            filename: "chapter5_assignment.pdf",
            url: "/uploads/chapter5_assignment.pdf",
        },
    },
];

module.exports = { sampleStudents, sampleAnnouncements, sampleNotes };