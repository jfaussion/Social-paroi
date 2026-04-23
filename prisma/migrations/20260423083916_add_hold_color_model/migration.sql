-- CreateTable
CREATE TABLE "hold_colors" (
    "id" SERIAL NOT NULL,
    "location_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hold_colors_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Track" ADD COLUMN "hold_color_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "hold_colors_location_id_order_key" ON "hold_colors"("location_id", "order");

-- AddForeignKey
ALTER TABLE "hold_colors" ADD CONSTRAINT "hold_colors_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_hold_color_id_fkey" FOREIGN KEY ("hold_color_id") REFERENCES "hold_colors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
