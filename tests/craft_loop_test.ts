import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Test NFT minting with validation",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    
    // Test invalid price
    let block = chain.mineBlock([
      Tx.contractCall('craft-loop', 'mint-nft',
        [
          types.utf8("Test NFT"),
          types.utf8("Test Description"),
          types.uint(0),
          types.utf8("{materials: 'wood'}")
        ],
        deployer.address
      )
    ]);
    
    block.receipts[0].result.expectErr(104); // err-invalid-price

    // Test valid mint
    block = chain.mineBlock([
      Tx.contractCall('craft-loop', 'mint-nft',
        [
          types.utf8("Test NFT"),
          types.utf8("Test Description"),
          types.uint(1000),
          types.utf8("{materials: 'wood'}")
        ],
        deployer.address
      )
    ]);
    
    block.receipts[0].result.expectOk().expectUint(1);
  }
});

// Additional tests...
