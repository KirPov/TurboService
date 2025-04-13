-- CreateTable
CREATE TABLE "application_services" (
    "applicationId" INTEGER NOT NULL,
    "serviceId" INTEGER NOT NULL,

    CONSTRAINT "application_services_pkey" PRIMARY KEY ("applicationId","serviceId")
);

-- CreateTable
CREATE TABLE "_ApplicationToService" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ApplicationToService_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ApplicationToService_B_index" ON "_ApplicationToService"("B");

-- AddForeignKey
ALTER TABLE "application_services" ADD CONSTRAINT "application_services_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_services" ADD CONSTRAINT "application_services_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationToService" ADD CONSTRAINT "_ApplicationToService_A_fkey" FOREIGN KEY ("A") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationToService" ADD CONSTRAINT "_ApplicationToService_B_fkey" FOREIGN KEY ("B") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
