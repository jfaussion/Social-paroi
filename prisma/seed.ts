import { PrismaClient } from '@prisma/client'
import { LocationStatus } from '../domain/LocationStatus.enum'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Step 1: Ensure location 1 exists (upsert handles both fresh DB and existing data)
  await prisma.location.upsert({
    where: { id: 1 },
    create: { id: 1, name: 'Pic & Paroi', type: 'gym', slug: 'pic-paroi', status: LocationStatus.published },
    update: { slug: 'pic-paroi', name: 'Pic & Paroi', status: LocationStatus.published },
  })
  console.log('Upserted location 1')

  // Step 2: Upsert DifficultyLevel rows for location 1 (8 levels in order)
  const difficultyLevels = [
    { order: 1, name: 'Unknown', color: '#6B7280' },
    { order: 2, name: 'Beginner', color: '#FFFFFF' },
    { order: 3, name: 'Easy', color: '#22C55E' },
    { order: 4, name: 'Intermediate', color: '#3B82F6' },
    { order: 5, name: 'Advanced', color: '#EC4899' },
    { order: 6, name: 'Difficult', color: '#EF4444' },
    { order: 7, name: 'FuckingHard', color: '#EAB308' },
    { order: 8, name: 'Legendary', color: '#000000' },
  ]

  for (const level of difficultyLevels) {
    await prisma.difficultyLevel.upsert({
      where: { locationId_order: { locationId: 1, order: level.order } },
      create: { locationId: 1, name: level.name, color: level.color, order: level.order },
      update: { name: level.name, color: level.color },
    })
  }
  console.log('Upserted 8 difficulty levels for location 1')

  // Step 3: Backfill contests with locationId = 0 (defensive)
  await prisma.contest.updateMany({
    where: { locationId: 0 },
    data: { locationId: 1 },
  })
  console.log('Backfilled contests with locationId=0')

  // Step 4: Backfill news with locationId = 0 (defensive)
  await prisma.news.updateMany({
    where: { locationId: 0 },
    data: { locationId: 1 },
  })
  console.log('Backfilled news with locationId=0')

  // Step 5: Create 10 Zone rows for location 1 (Zone 1 to Zone 10)
  for (let n = 1; n <= 10; n++) {
    await prisma.zone.upsert({
      where: { locationId_order: { locationId: 1, order: n } },
      create: { locationId: 1, name: `Zone ${n}`, order: n, miniMapUrl: null },
      update: { name: `Zone ${n}` },
    })
  }
  console.log('Upserted 10 zones for location 1')

  // Step 6: Backfill Track.zoneId from Track.zone for tracks belonging to location 1
  for (let n = 1; n <= 10; n++) {
    const zone = await prisma.zone.findUnique({
      where: { locationId_order: { locationId: 1, order: n } },
    })
    if (zone) {
      await prisma.track.updateMany({
        where: {
          zone: n,
          OR: [{ locationId: 1 }, { locationId: null }],
          zoneId: null,
        },
        data: { zoneId: zone.id },
      })
    }
  }
  console.log('Backfilled Track.zoneId from Track.zone for location 1 tracks')

  // Step 7: Migrate existing User.role values to UserLocationRole
  const users = await prisma.user.findMany({
    where: { role: { in: ['opener', 'admin'] } },
  })
  for (const user of users) {
    await prisma.userLocationRole.upsert({
      where: { userId_locationId: { userId: user.id, locationId: 1 } },
      create: { userId: user.id, locationId: 1, role: user.role as string },
      update: { role: user.role as string },
    })
  }
  console.log(`Migrated ${users.length} user roles to UserLocationRole`)

  // Step 8: Create UserLocation rows for ALL existing users
  const allUsers = await prisma.user.findMany()
  for (const user of allUsers) {
    await prisma.userLocation.upsert({
      where: { userId_locationId: { userId: user.id, locationId: 1 } },
      create: { userId: user.id, locationId: 1 },
      update: {},
    })
  }
  console.log(`Created UserLocation rows for ${allUsers.length} users`)

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
