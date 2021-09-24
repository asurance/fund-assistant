import { ClientSession, Db, MongoClient } from 'mongodb'

export async function useDatabase<Data>(
  name: string,
  callback: (db: Db, session: ClientSession) => Data | Promise<Data>,
): Promise<Data> {
  let client: MongoClient | null = null
  let session: ClientSession | null = null
  try {
    client = await MongoClient.connect(process.env.MONGODB_URL!)
    session = client.startSession()
    session.startTransaction()
    const data = await callback(client.db(name), session)
    await session.commitTransaction()
    await session.endSession()
    return data
  } catch (error) {
    if (session) {
      await session.abortTransaction()
    }
    throw error
  } finally {
    if (client) {
      client.close()
    }
  }
}
