-- CreateTable
CREATE TABLE "userNotification" (
    "id" SERIAL NOT NULL,
    "clientId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "formId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "userNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formAssignments" (
    "id" SERIAL NOT NULL,
    "clientId" TEXT NOT NULL,
    "questionIds" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "formAssignments_pkey" PRIMARY KEY ("id")
);
