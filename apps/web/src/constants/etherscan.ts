import { CHAIN_ID } from 'src/typings'

export const ETHERSCAN_BASE_URL = {
  [CHAIN_ID.ETHEREUM]: 'https://etherscan.io',
  [CHAIN_ID.GOERLI]: 'https://goerli.etherscan.io',
  [CHAIN_ID.OPTIMISM_GOERLI]: 'https://goerli-optimism.etherscan.io/',
}
