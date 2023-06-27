import * as Sentry from '@sentry/nextjs'

import { SDK } from 'src/data/subgraph/client'
import { Chain } from 'src/typings'

import {
  Auction_Filter,
  Auction_OrderBy,
  ExploreDaoFragment,
  OrderDirection,
} from '../sdk.generated'

export interface ExploreDaosResponse {
  daos: ExploreDaoFragment[]
}

export const userDaosFilter = async (
  chain: Chain,
  memberAddress: string
): Promise<ExploreDaosResponse | undefined> => {
  const userDaos = await SDK.connect(chain.id).daoTokenOwners({
    where: {
      owner: memberAddress,
    },
    first: 30,
  })

  const daoAddresses = userDaos.daotokenOwners.map((x) => x.dao.tokenAddress)
  const data = await SDK.connect(chain.id).myDaosPage({ daos: daoAddresses })

  return { daos: data.auctions }
}

export const exploreDaosRequest = async (
  chain: Chain,
  skip: number,
  orderBy: Auction_OrderBy = Auction_OrderBy.StartTime
): Promise<ExploreDaosResponse | undefined> => {
  try {
    const orderDirection =
      orderBy === Auction_OrderBy.EndTime ? OrderDirection.Asc : OrderDirection.Desc

    const where: Auction_Filter = {
      settled: false,
    }

    if (orderBy === Auction_OrderBy.HighestBidAmount) where.bidCount_gt = 0
    if (orderBy === Auction_OrderBy.EndTime)
      where.endTime_gt = Math.floor(Date.now() / 1000)

    const data = await SDK.connect(chain.id).exploreDaosPage({
      orderBy,
      orderDirection,
      where,
      skip,
    })

    if (!data.auctions) return undefined
    return { daos: data.auctions }
  } catch (error) {
    console.error(error)
    Sentry.captureException(error)
    await Sentry.flush(2000)
    return undefined
  }
}
