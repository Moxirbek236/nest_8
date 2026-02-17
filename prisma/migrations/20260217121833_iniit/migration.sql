-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "GroupStatus" ADD VALUE 'cancelled';
ALTER TYPE "GroupStatus" ADD VALUE 'freeze';

-- AlterEnum
ALTER TYPE "StudentStatus" ADD VALUE 'cancelled';

-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "status" SET DEFAULT 'planned';

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'active';
