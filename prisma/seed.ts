import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Text question
  await prisma.intakeQuestion.create({
    data: {
      question: "Enter your full name",
      fieldType: "text",
    },
  });
  await prisma.intakeQuestion.create({
    data: {
      question: "Enter your Contact Number",
      fieldType: "number",
    },
  });
  await prisma.intakeQuestion.create({
    data: {
      question: "What is your preferred method of contact?",
      fieldType: "radio",
      options: "Email,Phone,WhatsApp",
    },
  });
  await prisma.intakeQuestion.create({
    data: {
      question: "Enter your Email/Phone/WhatsApp",
      fieldType: "text",
    },
  });

  // Radio question with comma-separated options
  await prisma.intakeQuestion.create({
    data: {
      question: "Gender",
      fieldType: "radio",
      options: "Male,Female,Other",
    },
  });
  await prisma.intakeQuestion.create({
    data: {
      question: "Enter your location",
      fieldType: "text",
    },
  });

  //About the company
  await prisma.intakeQuestion.create({
    data: {
      question: "Enter your Company name",
      fieldType: "text",
    },
  });
  await prisma.intakeQuestion.create({
    data: {
      question: "Enter your Office Address",
      fieldType: "textarea",
    },
  });

  await prisma.intakeQuestion.create({
    data: {
      question: "Enter your Office Email",
      fieldType: "email",
    },
  });
  // Textarea question
  await prisma.intakeQuestion.create({
    data: {
      question: "How did you hear about us ?",
      fieldType: "textarea",
    },
  });

  await prisma.intakeQuestion.create({
    data: {
      question: "What is your nature of your business ?",
      fieldType: "textarea",
    },
  });
  await prisma.intakeQuestion.create({
    data: {
      question: "What type of services are you looking for ?",
      fieldType: "textarea",
    },
  });

  await prisma.intakeQuestion.create({
    data: {
      question: "Refered by?",
      fieldType: "text",
    },
  });
  await prisma.intakeQuestion.create({
    data: {
      question:
        "Can you explain your requirement",
      fieldType: "textarea",
    },
  });
  await prisma.intakeQuestion.create({
    data: {
      question:
        "Upload any relevant reports or documents (e.g., financial statements, business plans, etc.) that can help us understand your requirements better.",
      fieldType: "file",
    },
  });
}

main()
  .then(() => console.log("Seeding completed."))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
