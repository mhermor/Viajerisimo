/*
  Warnings:

  - A unique constraint covering the columns `[nombre,pais]` on the table `Destino` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Reserva" ADD COLUMN     "numPersonas" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "precioTotal" DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "Destino_nombre_pais_key" ON "Destino"("nombre", "pais");
