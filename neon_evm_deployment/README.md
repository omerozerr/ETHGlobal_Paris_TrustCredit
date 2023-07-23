GoblinTown uses the ERC721 standard for NFTs. Goblintown is an NFT project created for users to have fun and to increase interest in web3 games. The contract address of the 'GoblinTown' is 0xf302ba815651CA01732F765dAb83980b188DB728. You can see the transactions carried out on this contract via NeonScan.

Here's a breakdown of what the contract and its functions do:

- **Contract Declaration**: The contract is named `goblintown` and it extends `ERC721AQueryable`, `Ownable`, and `RevokableDefaultOperatorFilterer`. `ERC721AQueryable` is a variant of the ERC721 standard that adds functionality for querying all of the NFTs owned by a particular address. `Ownable` is a contract that has an owner address, and provides authorization control functions. `RevokableDefaultOperatorFilterer` is a contract that provides functionality for managing operator permissions.

- **Variables**: The contract has several state variables including `byebyething`, `_partslink`, `goblins`, and `byebye`. The `byebyething` is an address that has the ability to burn tokens. `_partslink` is used to form the metadata URI for each token. `goblins` is the total number of tokens that can be minted. `byebye` is a boolean that indicates whether the `byebyething` address can burn tokens.

- **makingobblin**: This function allows the contract owner to mint new tokens to specified addresses. It checks that the total supply after minting is less than the maximum supply, then mints the new tokens.

- **makegoblngobyebye**: This function allows the `byebyething` address to burn a specified token. It checks that the `byebye` variable is true and that the function caller is the `byebyething` address, then burns the token.

- **makegoblingo**: This function allows the contract owner to set the `byebyething` address and the `byebye` variable.

- **_baseURI**: This is an internal function that overrides the `_baseURI` function in the `ERC721` contract. It returns the base URI for the token metadata.

- **makegobblinhaveparts**: This function allows the contract owner to set the base URI for the token metadata.

- **sumthinboutfunds**: This function allows the contract owner to withdraw all Ether from the contract.

- **setApprovalForAll, approve, transferFrom, safeTransferFrom**: These functions override the corresponding functions in the `ERC721` contract. They add additional checks to ensure that the operator is allowed to perform the action.

- **owner**: This function overrides the `owner` function in the `Ownable` and `UpdatableOperatorFilterer` contracts. It returns the owner of the contract.

