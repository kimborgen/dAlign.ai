# dalign.ai

Hackathon project at EthGlobal Lisbon: https://ethglobal.com/showcase/dalign-ai-n2onx
- TheGraph: 2nd place best use
- Safe: 3rd place best use

**Democratizing aligment of AI trough decentralized and permissionless Aligment (RLHF) dataset generation, open and free to everyone to participate in making AI systems safe.**

Problem:
- Aligning and steering Artificial Intelligence towards human values
- Need to represent all of humanity, not just a select few
- Only 1 open-source alignment dataset of sufficient size and quality

Solution:
- Decentralized and permissionless dataset generation
- Consensus on controversial topics with no clear answer


Pitch presentation: https://docs.google.com/presentation/d/1lbBYT0qI8B3GCz5JhawMDibCXRfPZTRAyryzVGJl37M/edit?usp=sharing

Webapp: Users are presented with simple tasks randomly. Such as creating a prompt, creating an answer to a prompt, rating the quality of a prompt, and selecting one of two answers to a prompt. Made for simplicity.

Onboarding: A diverse population must go beyond the Web3 community, so the app is 100% free to use for users. No need any additional software (wallets). Enabled by the Account Abstraction stack from Safe Core (Auth, Protocol, and Relay kits) together with their partners Web3Auth and Gelato.

Backend: A smart contract backend is deployed on the gnosis-chain so that you can generate datasets of sufficient size (100k promt-answer pairs) for pocket-change.

Scaling: As the dataset grows in size, it is infeasble to process all of this data in frontend, subgraphs on The Graph enable the frontend to query smart contract data with GraphQL and work with large datasets without a centralized background.

### How it's Made
Frontend: React, Safe Core Kits (Auth, Protocol, and Relayer), GraphQL queries to The Graph to simplify development and get ready for scale. On-boarding non Web3 users trough account abstraction and sponsoring all transactions.

Smart Contract: Solidity, deployed on Gnosis (mainnet) to enable large datasets for next to nothing.
